<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class StockController extends Controller
{
    public function index()
    {
        $symbols = ['XLE', 'BP', 'SHEL', 'TTE', 'CVX', 'XOM'];
        $apiKey = env('FINNHUB_API_KEY');

        return Cache::remember('energy_stocks', 300, function () use ($symbols, $apiKey) {
            $data = [];
            foreach ($symbols as $symbol) {
                $response = Http::withoutVerifying()->get("https://finnhub.io/api/v1/quote", [
                    'symbol' => $symbol,
                    'token' => $apiKey
                ]);

                if ($response->successful()) {
                    $json = $response->json();
                    $data[] = [
                        'symbol' => $symbol,
                        'price' => $json['c'] ?? 0,
                        'change' => $json['d'] ?? 0,
                        'changePercent' => $json['dp'] ?? 0,
                    ];
                }
            }
            return $data;
        });
    }
}
