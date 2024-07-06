<?php

namespace App\Http\Requests;

use App\Rules\LoanHasClient;
use Illuminate\Foundation\Http\FormRequest;

class StoreLoanRequest extends FormRequest
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
        return [                                               //POR SI EL CLIENTE SOLO PUEDA TENER UN PRESTAMO
            'client_id' => ['required', 'exists:clients,id'/* , new LoanHasClient */],
            'user_id'=>['required','exists:users,id'],
            'amount'=>['required','numeric','max:10000','min:100'],
            'date_start' => ['required', 'date'],
            'interest' => ['required', 'numeric', 'min:10', 'max:50']
        
        ];
    }
}
