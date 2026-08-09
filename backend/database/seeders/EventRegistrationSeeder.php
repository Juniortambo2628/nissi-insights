<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Database\Seeder;

class EventRegistrationSeeder extends Seeder
{
    public function run()
    {
        $events = Event::all();

        $registrations = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '+254 712 345 678',
                'organization' => 'Ministry of Energy',
                'attended' => true,
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@globalcap.com',
                'phone' => '+44 20 7123 4567',
                'organization' => 'Global Capital Partners',
                'attended' => false,
            ],
            [
                'name' => 'Michael Chen',
                'email' => 'm.chen@asiapower.com',
                'phone' => '+852 2345 6789',
                'organization' => 'Asia Power Corp',
                'attended' => true,
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah@sustainable.io',
                'phone' => '+1 415 555 0123',
                'organization' => 'Sustainable Energy Labs',
                'attended' => false,
            ],
            [
                'name' => 'Ahmed Hassan',
                'email' => 'ahmed@nairobibank.co.ke',
                'phone' => '+254 722 000 111',
                'organization' => 'Nairobi Commercial Bank',
                'attended' => true,
            ],
        ];

        foreach ($events as $event) {
            foreach ($registrations as $reg) {
                // Add some randomness to which event they register for
                if (rand(0, 1)) {
                    EventRegistration::create(array_merge($reg, ['event_id' => $event->id]));
                }
            }
        }
    }
}
