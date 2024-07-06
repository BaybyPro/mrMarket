<?php

namespace App\Http\Requests;

use App\Rules\ValidAmountPaid;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePayRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Retrieve the pay ID from the route parameter
        $payId = $this->route('pay');

        return [
            'amount_paid' => ['required', 'numeric', new ValidAmountPaid($payId)],
            'status' => ['required', 'numeric', 'max:4'],
            'user_id' => ['required', 'exists:users,id', 'numeric']
        ];
    }
}
