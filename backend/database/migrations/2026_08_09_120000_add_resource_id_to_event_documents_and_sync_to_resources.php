<?php

use App\Models\Event;
use App\Models\EventDocument;
use App\Models\Resource;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_documents', function (Blueprint $table) {
            $table->unsignedBigInteger('resource_id')->nullable()->after('id');
        });

        // Sync existing event documents to knowledge hub
        foreach (EventDocument::with('event')->get() as $doc) {
            $resourceData = [
                'title' => $doc->title,
                'slug' => \Illuminate\Support\Str::slug($doc->title).'-'.$doc->id,
                'type' => 'event',
                'is_published' => $doc->is_published,
                'tags' => ['event', 'event-'.$doc->event_id],
            ];

            if ($doc->type === 'link') {
                $resourceData['external_link'] = $doc->path;
            } else {
                $resourceData['file_path'] = $doc->path;
            }

            if ($doc->event) {
                $resourceData['description'] = 'Resource from event: '.$doc->event->title;
            }

            $resource = Resource::create($resourceData);
            $doc->update(['resource_id' => $resource->id]);
        }
    }

    public function down(): void
    {
        // Delete synced resources
        Resource::where('type', 'event')->delete();

        Schema::table('event_documents', function (Blueprint $table) {
            $table->dropColumn('resource_id');
        });
    }
};
