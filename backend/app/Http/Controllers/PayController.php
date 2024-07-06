<?php

namespace App\Http\Controllers;

use App\Models\Pay;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePayRequest;
use App\Http\Requests\UpdatePayRequest;

class PayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    
    public function getPaysByLoan($loan_id)
    {
        $pays = Pay::where('loan_id',$loan_id)->orderBy('id','asc')->get();
        return response()->json($pays, 200);
    }

    public function getPaysActive($loan_id){
        $paysActive = Pay::where('loan_id',$loan_id)
                         ->whereIn('status',[1,2,3,4])
                         ->orderBy('id','asc')
                         ->get();
        return response()->json($paysActive, 200);
    }

    public function getPaysLader($loan_id){
        $paysActive = Pay::where('loan_id',$loan_id)
                         ->whereIn('status',[5])
                         ->orderBy('id','asc')
                         ->get();
        return response()->json($paysActive, 200);
    }
    
    
    public function store(StorePayRequest $request)
    {
        // Valida la solicitud y crea un nuevo pago
        $data = $request->validated();
        Pay::create($data);

        return response()->json(['message' => 'Pago creado exitosamente'], 201);
    }

    
    public function show(Pay $pay)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pay $pay)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePayRequest $request, $payId)
    {
        // Asumimos que $payId es el ID del pago a actualizar
    $pay = Pay::findOrFail($payId);

    // Actualiza los campos del pago con los datos validados del request
    $pay->update($request->validated());
        return response(['message' => 'Pago actualizado correctamente'], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pay $pay)
    {
        //
    }
}
