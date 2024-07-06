<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable=[
        'name',
        'lastname',
        'dni',
        'address',
        'phone_number',
        'status'

    ];

    public function loans(){
        return $this->hasMany(Loan::class);
    }

    public function pays(){
        return $this->hasMany(Pay::class);
    }
}
