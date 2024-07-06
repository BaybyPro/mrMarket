<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Loan;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    return Client::orderBy('status', 'desc')  // Ordenar por status descendente
                 ->orderBy('id', 'desc')      // Luego, ordenar por id descendente
                 ->paginate(15);
}


    public function getClientsByFilter(Request $request)
    {
        $filter = $request->query('filter');
        $data = $request->query('data');
    
        // Verificar si los parámetros necesarios están presentes y válidos
        if (!$filter || !$data || $filter === 'Filtrar por') {
            return response()->json(['message' => 'Filtro y dato son necesarios'], 400);
        }
    
        // Convertir ambos a minúsculas para una comparación insensible a mayúsculas y minúsculas
        $clients = Client::whereRaw('LOWER(' . $filter . ') LIKE ?', [strtolower($data) . '%'])
                          ->orderBy('id', 'desc')
                          ->get();
        
        return response()->json($clients, 200);
    }
    
    public function getClientsByLoan($loanId){
        // Buscar el préstamo por su ID
        $loan = Loan::find($loanId);

        // Obtener el cliente asociado al préstamo
        $client = $loan->client;

        // Retornar los datos del cliente en formato JSON
        return response()->json($client, 200);

    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }


    public function store(StoreClientRequest $request)
    {
        $newClient = Client::create($request->validated());
        return response(['message'=>'cliente agregado correctamente'], 201); 
    }

    public function show(Client $client)
    {
        return response()->json($client);
    }

    public function edit(Client $client)
    {
        //
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        $client->update(($request)->validated());
        return response(['message'=>'cliente actualizado correctamente'], 201);
    }


    public function destroy(Client $client)
    {
        //
    }
}
