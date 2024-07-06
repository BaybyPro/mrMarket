<?php

namespace App\Http\Requests;

use App\Rules\ValidCreatePaid;
use Illuminate\Foundation\Http\FormRequest;

class StorePayRequest extends FormRequest
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
        return [
            'loan_id' => ['required', 'exists:loans,id'],
            'user_id' => ['required', 'exists:users,id'],
            'day' => ['required', 'date'],
            'amount_paid' => ['required', 'numeric', new ValidCreatePaid($this->loan_id)],
            'status' => ['required', 'numeric'],
        ];
    }
}
