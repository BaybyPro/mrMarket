<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserUpdate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        User::create([
            'name' => $request->input('name'),
            'password' => Hash::make($request->input('password'))
        ]);

        return response()->json(['message' => 'Usuario creado con éxito.',201]);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('name', 'password'))) {
            return response(['message' => 'Usuario invalido'], 401);
        }

        $token = $request->user()->createToken('token');

        return ['token' => $token->plainTextToken];
    }

    public function getUser(Request $request)
    {
        return $request->user();
    }

    public function getUsers()
    {
        return User::get();
    }

    public function getUserById($user_id)
    {
        $user = User::where('id', $user_id)->get();
        return response()->json($user, 200);
    }

    public function getUsersByIds(Request $request)
    {
        $ids = $request->input('ids');
        $users = User::whereIn('id', $ids)->get();
        return response()->json($users);
    }

    public function updateUser(UserUpdate $request, $id)
    {
        // Validar la solicitud
        $request->validated();

        // Obtener el usuario
        $user = User::findOrFail($id);

        // Verificar si se ha proporcionado la contraseña actual
        if ($request->filled('password')) {
            // Verificar que la contraseña actual sea correcta
            if (!Hash::check($request->input('password'), $user->password)) {
                throw ValidationException::withMessages([
                    'password' => ['La contraseña actual es incorrecta.']
                ]);
            }

            // Actualizar el nombre del usuario
            $user->name = $request->input('name');

            // Verificar si se ha proporcionado una nueva contraseña
            if ($request->filled('new_password')) {
                // Actualizar la contraseña
                $user->password = Hash::make($request->input('new_password'));
            }

            // Guardar los cambios
            $user->save();

            return response()->json(['message' => 'Usuario actualizado con éxito.']);
        }

        // Si no se proporciona la contraseña actual, devolver un error
        return response()->json(['error' => 'Debe proporcionar la contraseña actual para actualizar los datos.'], 400);
    }

    public function deleteUser($id){
        $user = User::findOrFail($id);

        if(!$user){
            return response()->json(['error' => 'usuario no encontrado'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado con éxito.'],201);
    }
}
