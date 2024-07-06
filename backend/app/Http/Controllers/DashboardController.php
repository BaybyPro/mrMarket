<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Loan;
use App\Models\Pay;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getDashboardData()
    {
        $totalInvested = Loan::sum('amount');
        $totalEarned = Pay::whereIn('status', [2, 3, 5])->sum('amount_paid');
        $totalClients = Client::count();
        $totalLoans = Loan::count();

        return response()->json([
            'total_invested' => $totalInvested,
            'total_earned' => $totalEarned,
            'total_clients' => $totalClients,
            'total_loans' => $totalLoans,
        ]);
    }

    public function getDataByMonth($date)
    {
        list($year, $month) = explode('-', $date);

        $totalEarned = Pay::whereIn('status', [2, 3, 5])
            ->whereYear('day', $year)
            ->whereMonth('day', $month)
            ->sum('amount_paid');

        $totalLoans = Loan::whereYear('date_start', $year)
            ->whereMonth('date_start', $month)
            ->count();
        $totalInvested = Loan::whereYear('date_start', $year)
            ->whereMonth('date_start', $month)
            ->sum('amount');

        $totalClients = Client::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count();

        return response()->json([
            'total_earned' => $totalEarned,
            'total_invested' => $totalInvested,
            'total_clients' => $totalClients,
            'total_loans' => $totalLoans,
        ]);
    }

    public function getDataByDay($day)
    {
        $totalEarned = Pay::whereIn('status', [2, 3, 5])
            ->whereDate('updated_at', $day)
            ->sum('amount_paid');

        $dataPending = Pay::whereIn('status', [2, 3, 5])
                           ->whereDate('updated_at', $day)
                           ->get();
        $totalLoaned = Loan::whereDate('date_start', $day)
            ->sum('amount');

        $dataLoans = Loan::whereDate('date_start', $day)
            ->get();


        return response()->json([
            'total_earned' => $totalEarned,
            'data_earned' => $dataPending,
            'total_loaned' => $totalLoaned,
            'data_loans' => $dataLoans,
        ]);
    }

    public function getDataUser($date){
        // Obtener todos los usuarios
        $users = User::all();
        list($year, $month) = explode('-', $date);
        
    
        // Crear una colección para almacenar los datos de los usuarios junto con el total de loans y pays
        $userData = $users->map(function ($user) use ($year, $month) {
            $totalLoans = Loan::where('user_id', $user->id)
                                ->count();
                                
            $totalPays = Pay::where('user_id', $user->id)
                                ->count();
            
            $loansMonth =Loan::where('user_id', $user->id)
                              ->whereYear('date_start', $year)
                              ->whereMonth('date_start', $month)
                              ->count();
            // Formatear la fecha de creación del usuario
            $createdDate = $user->created_at->format('Y-m-d');
            return [
                'id' => $user->id,
                'name' => $user->name,
                'rol' => $user->rol,
                'created'=> $createdDate,
                'total_loans' => $totalLoans,
                'total_pays' => $totalPays,
                'loans_month' => $loansMonth,
                'pays_month' => $totalPays,
            ];
        });
    
        return response()->json(['users' => $userData]);
    }
    
}
