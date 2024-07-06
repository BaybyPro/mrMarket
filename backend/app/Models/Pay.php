<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;


class Pay extends Model
{
    use HasFactory;
    protected $fillable =[
        'loan_id',
        'day',
        'amount_paid',
        'status',
        'user_id'
    ];

    public function loan(){
        return $this->belongsTo(Loan::class)->withDefault();
    }

    public function client(){
        return $this->belongsTo(Client::class)->withDefault();
    }

    public function user(){
        return $this->belongsTo(User::class)->withDefault();
    }

    protected static function booted()
    {

        static::saving(function ($pay) {
            if ($pay->status == 2 || $pay->status == 3) {
                $loan = $pay->loan;
                if ($pay->amount_paid > $loan->missing) {
                    throw ValidationException::withMessages(['message' => 'El pago no puede ser mayor al faltante']);
                }
            }
        });

        static::updated(function ($pay) {
            if ($pay->status == 2 || $pay->status == 3) {
                $loan = $pay->loan;
                $loan->missing -= $pay->amount_paid;
                $loan->save();
            }

            if($pay->status==4){
                $loan = $pay->loan;

                // Cambiar el estado del loan a 3 si el pay tiene estado 4
                $loan->status = 3;
                $loan->save();

                // Contar la cantidad de pays con estado 4
                $countStatus4 = $loan->pay()->where('status', 4)->count();
                // Si hay 3 o más pays con estado 4, cambiar el estado del loan a 4
                if ($countStatus4 >= 3) {
                    $loan->status = 4;
                    $loan->save();
                }
            }
        });
    }
}
