<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Loan extends Model
{
    use HasFactory;

    protected $fillable=[
        'client_id',
        'user_id',
        'amount',
        'date_start',
        'date_end',
        'interest',
        'total',
        'missing',
        'status'
    ];

    public function pay(){
        return $this->hasMany(Pay::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class)->withDefault();
    }

    public function user(){
        return $this->belongsTo(User::class)->withDefault();
    }

    protected static function booted()
    {
        static::updating(function ($loan) {
            
            if ($loan->missing == 0) {
                
                $loan->status = 1;
            }
        });

        

        static::creating(function ($loan) {
            // Calcular la fecha de finalización (date_end) excluyendo los domingos
            $date = Carbon::parse($loan->date_start);
            $daysAdded = 0;

            while ($daysAdded < 24) {
                if (!$date->isSunday()) {
                    $daysAdded++;
                }
                $date->addDay();
            }

            // Restar un día porque el bucle añade un día de más al salir
            $loan->date_end = $date->subDay()->toDateString();

            // Calcular y asignar el total
            $interest = $loan->amount * ($loan->interest / 100);
            $loan->total = $loan->amount + $interest;
            $loan->missing = $loan->amount + $interest;
        });
        
        static::created(function ($loan) {

            
            // Crear 24 registros en la tabla Pay, omitiendo domingos
            $date = Carbon::parse($loan->date_start);
            $daysAdded = 0;
            $interest = $loan->amount * ($loan->interest / 100);
            $total = $loan->amount+$interest;
            $pay = $total/24;

            while ($daysAdded < 24) {
                if ($date->isSunday()) {
                    $date->addDay();
                    continue;
                }

                Pay::create([
                    'loan_id' => $loan->id,
                    'day' => $date->copy(),
                    'amount_paid' => $pay,
                ]);

                $date->addDay();
                $daysAdded++;
            }
        });
    }
}
