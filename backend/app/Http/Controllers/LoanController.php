<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLoanRequest;
use App\Http\Requests\UpdateLoanRequest;
use Illuminate\Support\Facades\Auth;

class LoanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Loan::orderBy('id','desc')->paginate();
    }

    public function create()
    {
        //
    }

    public function store(StoreLoanRequest $request)
    {
        $loanData = $request->validated();
        $loanData['status'] = $loanData['status'] ?? '2'; // Asegurar que haya un valor predeterminado para status
        $loan = Loan::create($loanData);
        return response(['message' => 'Préstamo agregado correctamente'], 201);
    }

    public function getLoanById($Loan_id){
        $Loan = Loan::where('id',$Loan_id)->orderBy('id','desc')->get();
        if(!$Loan){
            return response(['message' => 'Préstamo no encontrado'], 404);
        }else{
            return response()->json($Loan,200);
        }
     }

     public function getLoanByClient($Client_id){
        $Loans = Loan::where('client_id',$Client_id)->orderBy('id','desc')->get();
        return response()->json($Loans,200);
     }

     public function getLoanActive(){
        return Loan::whereIn('status',[2,3,4])->orderBy('id','desc')->get();
     }

 
    public function show(Loan $loan)
    {
        //
    }

    public function edit(Loan $loan)
    {
        //
    }

    public function update(UpdateLoanRequest $request, Loan $loan)
    {
        //
    }


    public function destroy(Loan $loan)
    {
        $user = Auth::user();
    
    if ($user->rol !== 'owner') {
        return response()->json(['message' => 'solo el owner puede eliminar prestamos'], 403);
    }

    $loan->delete();

    return response()->json(['message' => 'Prestamo eliminado correctamente'], 200);
    }
}
