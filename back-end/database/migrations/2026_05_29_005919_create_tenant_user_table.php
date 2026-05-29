<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tenant_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
        
        // Make password nullable for the user to support ETL import without password
        Schema::table('users', function (Blueprint $table) {
            $table->string('password')->nullable()->change();
            // We can keep tenant_id on users as nullable for "default" or active tenant, 
            // but pivot is the source of truth for multiple tenants.
            $table->foreignId('tenant_id')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tenant_user');
        
        Schema::table('users', function (Blueprint $table) {
            $table->string('password')->nullable(false)->change();
            $table->foreignId('tenant_id')->nullable(false)->change();
        });
    }
};
