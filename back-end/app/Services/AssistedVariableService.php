<?php

namespace App\Services;

use Illuminate\Support\Facades\Schema;

class AssistedVariableService
{
    protected ?array $cachedVariables = null;

    protected array $columnMapping = [
        'name' => ['nome', 'Nome completo'],
        'nickname' => ['apelido', 'Apelido'],
        'social_name' => ['nome_social', 'Nome social'],
        'mother_name' => ['nome_mae', 'Nome da mãe'],
        'father_name' => ['nome_pai', 'Nome do pai'],
        'kind_of_person' => ['tipo_pessoa', 'Tipo de pessoa (PF/PJ)'],
        'is_under_age' => ['menor_idade', 'Menor de idade'],
        'cpf' => ['cpf', 'CPF'],
        'cnpj' => ['cnpj', 'CNPJ'],
        'birth_date' => ['data_nascimento', 'Data de nascimento'],
        'rg' => ['rg', 'RG'],
        'issuing_body' => ['orgao_expedidor', 'Órgão expedidor'],
        'uf_issuing_body' => ['uf_orgao_expedidor', 'UF do órgão expedidor'],
        'marital_status' => ['estado_civil', 'Estado civil'],
        'profession' => ['profissao', 'Profissão'],
        'education' => ['escolaridade', 'Escolaridade'],
        'monthly_income' => ['renda_mensal', 'Renda mensal'],
        'priority' => ['prioridade', 'Prioridade'],
        'dependents_number' => ['numero_dependentes', 'Número de dependentes'],
        'nationality' => ['nacionalidade', 'Nacionalidade'],
        'naturalness' => ['naturalidade', 'Naturalidade'],
        'telephone' => ['telefone', 'Telefone'],
        'telephone2' => ['telefone2', 'Telefone 2'],
        'email' => ['email', 'E-mail'],
        'email2' => ['email2', 'E-mail 2'],
        'voter_registration' => ['titulo_eleitor', 'Título de eleitor'],
        'pis' => ['pis', 'PIS'],
        'description' => ['descricao', 'Descrição'],
        'state_subscription' => ['inscricao_estadual', 'Inscrição estadual'],
        'local_subscription' => ['inscricao_municipal', 'Inscrição municipal'],
        'size_of_company' => ['porte_empresa', 'Porte da empresa'],
    ];

    protected array $addressMapping = [
        'cep' => ['cep', 'CEP'],
        'street_name' => ['logradouro', 'Logradouro'],
        'number' => ['numero', 'Número'],
        'complement' => ['complemento', 'Complemento'],
        'neighborhood' => ['bairro', 'Bairro'],
        'city' => ['cidade', 'Cidade'],
        'state' => ['estado', 'Estado'],
    ];

    protected array $aliases = [
        'assistido_nome' => [
            'target' => 'nome',
            'description' => 'Nome completo (alias para {{nome}})',
        ],
    ];

    protected array $systemVariables = [
        'data_atual' => [
            'description' => 'Data atual no momento da geração do documento',
            'example' => '01/01/2025',
        ],
        'endereco' => [
            'description' => 'Endereço completo do assistido (rua, número, bairro, cidade, CEP)',
            'example' => 'Rua das Flores, 123 - Centro, São Paulo/SP - CEP: 01234-567',
        ],
    ];

    protected array $excludedColumns = [
        'id', 'creator_id', 'address_id', 'ethnicity_id', 'gender_id',
        'id_number_internal', 'id_old_bonsae', 'id_audora',
        'filename', 'created_at', 'updated_at',
    ];

    public function getAllVariables(): array
    {
        if ($this->cachedVariables !== null) {
            return $this->cachedVariables;
        }

        $variables = [];

        $clientColumns = $this->getExistingColumns('clients');
        foreach ($clientColumns as $column) {
            if (in_array($column, $this->excludedColumns)) {
                continue;
            }
            if (isset($this->columnMapping[$column])) {
                [$name, $description] = $this->columnMapping[$column];
                $variables[$name] = [
                    'field' => $column,
                    'description' => $description,
                    'example' => '',
                    'source' => 'auto',
                ];
            }
        }

        $addressColumns = $this->getExistingColumns('addresses');
        foreach ($addressColumns as $column) {
            if (in_array($column, ['id', 'created_at', 'updated_at'])) {
                continue;
            }
            if (isset($this->addressMapping[$column])) {
                [$name, $description] = $this->addressMapping[$column];
                $variables[$name] = [
                    'field' => 'address.' . $column,
                    'description' => $description,
                    'example' => '',
                    'source' => 'auto',
                ];
            }
        }

        foreach ($this->aliases as $aliasName => $alias) {
            $variables[$aliasName] = [
                'field' => $alias['target'],
                'description' => $alias['description'],
                'example' => '',
                'source' => 'alias',
            ];
        }

        foreach ($this->systemVariables as $sysName => $sys) {
            $variables[$sysName] = [
                'field' => null,
                'description' => $sys['description'],
                'example' => $sys['example'],
                'source' => 'system',
            ];
        }

        ksort($variables);

        $this->cachedVariables = $variables;

        return $variables;
    }

    public function getAllVariableNames(): array
    {
        return array_keys($this->getAllVariables());
    }

    public function getAutoVariableNames(): array
    {
        $vars = $this->getAllVariables();
        return array_keys(array_filter($vars, fn ($v) => $v['source'] === 'auto'));
    }

    protected function getExistingColumns(string $table): array
    {
        if (!Schema::hasTable($table)) {
            return [];
        }
        return Schema::getColumnListing($table);
    }
}
