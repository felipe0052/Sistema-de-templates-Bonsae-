<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'cep',
        'street_name',
        'number',
        'complement',
        'neighborhood',
        'city',
        'state',
    ];

    public function assisted(): HasOne
    {
        return $this->hasOne(Assisted::class, 'address_id');
    }
}
