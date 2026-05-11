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
    Schema::create('assisted', function (Blueprint $table) {
        $table->id();
        $table->string('id_number_internal')->nullable();
        $table->integer('id_old_bonsae')->nullable();
        $table->integer('id_audora')->nullable();
        $table->unsignedInteger('creator_id');
        $table->unsignedInteger('address_id')->nullable();
        $table->integer('ethnicity_id')->nullable();
        $table->integer('gender_id')->nullable();
        $table->string('name');
        $table->string('nickname')->nullable();
        $table->string('social_name')->nullable();
        $table->string('mother_name')->nullable();
        $table->string('father_name')->nullable();
        $table->char('kind_of_person')->nullable();
        $table->char('is_under_age')->nullable();
        $table->boolean('priority')->default(false);
        $table->string('cpf', 30)->nullable();
        $table->string('cnpj')->nullable();
        $table->string('size_of_company')->nullable();
        $table->string('state_subscription')->nullable();
        $table->string('local_subscription')->nullable();
        $table->date('birth_date')->nullable();
        $table->string('voter_registration', 30)->nullable();
        $table->string('pis')->nullable();
        $table->longText('description')->nullable();
        $table->string('rg', 20)->nullable();
        $table->string('issuing_body')->nullable();
        $table->string('uf_issuing_body', 2)->nullable();
        $table->string('marital_status', 30)->nullable();
        $table->string('profession')->nullable();
        $table->string('education')->nullable();
        $table->double('monthly_income', 8, 2)->nullable();
        $table->unsignedInteger('dependents_number')->nullable();
        $table->string('nationality', 100)->nullable();
        $table->string('naturalness')->nullable();
        $table->string('telephone', 30)->nullable();
        $table->string('telephone2', 30)->nullable();
        $table->string('email')->nullable();
        $table->string('email2')->nullable();
        $table->string('filename')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assisted');
    }
};
