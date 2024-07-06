<?php

namespace App\Rules;

use App\Models\Loan;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class LoanHasClient implements ValidationRule
{

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $LoanActive = Loan::where('client_id', $value)
                    ->where('status', '!=', '1')
                    ->exists();

        if ($LoanActive) {
            $fail('Este cliente ya tiene un préstamo activo.');
        }
    }

}
