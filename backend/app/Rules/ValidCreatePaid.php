<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use App\Models\Loan;

class ValidCreatePaid implements ValidationRule
{   

    private $loan_id;

    public function __construct($loan_id)
    {
        $this->loan_id = $loan_id;
    }   


    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //encontrar el prestamo vinculado
        $loan = Loan::find($this->loan_id);


        if(!$loan){
            $fail('No existe el prestamo');
        }

        if($value > $loan->missing){
            $fail('El pago no puede ser mayor al fantante');
        }

        if($value <= 0.99){
            $fail('El pago no puede ser 0');
        }


    }
}
