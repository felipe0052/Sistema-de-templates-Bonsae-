<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'domain', 'logo_url'];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function templates()
    {
        return $this->hasMany(Template::class);
    }
}
