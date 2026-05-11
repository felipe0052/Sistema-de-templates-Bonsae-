<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assisted extends Model
{
    use HasFactory;

    protected $table = 'clients'; // aponta para a tabela existente no banco

    protected $fillable = [
        'creator_id',
        'address_id',
        'name',
        'nickname',
        'social_name',
        'mother_name',
        'father_name',
        'kind_of_person',
        'is_under_age',
        'priority',
        'cpf',
        'cnpj',
        'birth_date',
        'rg',
        'issuing_body',
        'uf_issuing_body',
        'marital_status',
        'profession',
        'education',
        'monthly_income',
        'nationality',
        'naturalness',
        'telephone',
        'telephone2',
        'email',
        'email2',
    ];
}