<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('client')->onDelete('cascade');//ellimina los datos loan si el el cliente es eliminado
            $table->foreignId('user_id')->constrained('users');
            $table->decimal('amount',7,2);
            $table->decimal('total',7,2);
            $table->decimal('missing',5,2);
            $table->date('date_start');
            $table->date('date_end');
            $table->string('interest',3)->nullable();
            $table->string('status',1)->default('2');;
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan');
    }
};
