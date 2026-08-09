<?php

it('returns stock data', function () {
    $response = $this->getJson('/api/stocks');

    $response->assertOk()
        ->assertJsonCount(6)
        ->assertJsonStructure([
            '*' => ['symbol', 'price', 'change', 'changePercent'],
        ]);
});

it('returns expected stock symbols', function () {
    $response = $this->getJson('/api/stocks');

    $response->assertOk();

    $data = $response->json();
    $symbols = array_column($data, 'symbol');

    expect($symbols)->toContain('XLE', 'BP', 'SHEL', 'TTE', 'CVX', 'XOM');
});

it('returns numeric price values', function () {
    $response = $this->getJson('/api/stocks');

    $response->assertOk();

    $data = $response->json();
    foreach ($data as $stock) {
        expect($stock['price'])->toBeNumeric();
        expect($stock['change'])->toBeNumeric();
        expect($stock['changePercent'])->toBeNumeric();
    }
});
