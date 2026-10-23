<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedBlock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class SavedBlockController extends Controller
{
    /**
     * Block node types that can be saved for reuse. Must match the TipTap
     * node names registered in the newsletter editor.
     */
    private const BLOCK_TYPES = [
        'niBox',
        'niHighlight',
        'niStats',
        'niKeyDates',
        'niCta',
        'niGrid',
        'contentReference',
    ];

    public function index(Request $request)
    {
        if (! Schema::hasTable('saved_blocks')) {
            return response()->json([
                'message' => 'Database migration pending: saved_blocks table missing. Run php artisan migrate.',
            ], 503);
        }

        $blocks = SavedBlock::where('user_id', $request->user()->id)
            ->orderByDesc('updated_at')
            ->get();

        return response()->json($blocks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'block_type' => ['required', 'string', 'in:'.implode(',', self::BLOCK_TYPES)],
            'content' => 'required|array',
            'content.type' => 'required|string',
        ]);

        // validated() only returns the dot-validated subset of content (type);
        // the full TipTap node JSON lives under the raw input.
        $validated['content'] = $request->input('content');
        $validated['user_id'] = $request->user()->id;

        return response()->json(SavedBlock::create($validated), 201);
    }

    public function destroy(Request $request, SavedBlock $block)
    {
        if ($block->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $block->delete();

        return response()->json(null, 204);
    }
}
