"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { ProfileCard, SecurityCard } from "@/components/settings";

export default function ConfiguracoesPage() {
    return (
        <DashboardLayout
            title="Configurações"
            subtitle="Gerencie as configurações do sistema"
        >
            <div className="space-y-6 max-w-4xl">
                <ProfileCard />

                <SecurityCard />
            </div>
        </DashboardLayout>
    );
}
