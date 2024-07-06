<?php

namespace App\Rules;

use App\Models\Pay;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidAmountPaid implements ValidationRule
{
    protected $payId;

    public function __construct($payId)
    {
        $this->payId = $payId;
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Attempt to find the Pay object with the given ID
        $pay = Pay::find($this->payId);

        // Check if the Pay object exists
        if (!$pay) {
            $fail('Invalid pay ID.');
            return;
        }

        // Validation: ensure the new amount_paid is between 1 and the current amount_paid
        if ($value > $pay->amount_paid) {
            $fail('El pago no puede ser mayor al cobro');
        }

        if ($value < 1) {
            $fail('El pago no puede ser menor que 1.');
        }
    }
}
