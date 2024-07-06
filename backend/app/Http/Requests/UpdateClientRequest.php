<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
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
            'name' => ['required', 'max:50', 'regex:/^[\pL\s]+$/u'],
            'lastname'=>['required', 'max:50', 'regex:/^[\pL\s]+$/u'],
            
            'address'=>['required','max:100'],
            'phone_number'=>['required','numeric','digits:9']
        ];
    }
    public function messages(): array
    {
        return [
            'name.regex' => 'El campo nombre solo acepta letras y espacios.',
            'lastname.regex' => 'El campo apellido solo acepta letras y espacios.',
        ];
    }
}
