<?php

namespace App\Observers;

use App\Models\Loan;

class LoanObserver
{
    
    public function created(Loan $loan): void
    {
        $this->updateClientStatusOnCreate($loan);
    }

  
    public function updated(Loan $loan): void
    {
        $this->updateClientStatusOnUpdate($loan);
    }

    protected function updateClientStatusOnCreate(Loan $loan)
    {
        $client = $loan->client;
        if ($client && $loan->status !== null && !in_array($client->status, [3, 4])) {
            $client->status = $loan->status;
            $client->save();
        }
    }

    protected function updateClientStatusOnUpdate(Loan $loan)
    {
        $client = $loan->client;
            if ($client->status == 4) {
                // Si el cliente tiene estado 4, solo cambiar si el nuevo estado es 1
                if ($loan->status == 1 && !$this->hasOtherLoansWithStatus($client, [2, 3, 4])) {
                    $client->status = $loan->status;
                    $client->save();
                }
            }elseif($client->status == 3){
                // Si el cliente tiene estado 3, solo cambiar si el nuevo estado es 1 
                if ($loan->status == 1 && !$this->hasOtherLoansWithStatus($client, [2,3, 4])) {
                    $client->status = $loan->status;
                    $client->save();
                }else{
                    $client->status = $loan->status;
                    $client->save();
                }
            } else {
                $client->status = $loan->status;
                $client->save();
            }
        
    }

    protected function hasOtherLoansWithStatus($client, $statuses)
    {
        // Verifica si el cliente tiene otros préstamos con los estados especificados
        return $client->loans()->whereIn('status', $statuses)->exists();
    }
  
    public function deleted(Loan $loan): void
    {
        $client = $loan->client;
        if (!$this->hasOtherLoansWithStatus($client, [2,3, 4])) {
            $client->status = 1;
            $client->save();
        }
    }

  
    public function restored(Loan $loan): void
    {
        //
    }

  
    public function forceDeleted(Loan $loan): void
    {
        //
    }
}
