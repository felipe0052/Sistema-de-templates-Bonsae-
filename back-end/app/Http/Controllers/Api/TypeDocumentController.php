<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TypeDocument;
use Illuminate\Http\Request;

class TypeDocumentController extends Controller
{
    public function index()
    {
        $types = TypeDocument::orderBy('name')->get();

        return response()->json([
            'data' => $types,
        ]);
    }
}
