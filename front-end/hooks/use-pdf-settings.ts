"use client";
import { useState, useEffect } from "react";
import { useUserPreferences, useUpdateUser } from "@/hooks/use-user";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function usePdfSettings() {
    const { token } = useAuth();
    const prefs = useUserPreferences();
    const updateUser = useUpdateUser();

    const [pdfFormat, setPdfFormat] = useState("a4");
    const [margins, setMargins] = useState({
        top: "20",
        bottom: "20",
        left: "25",
        right: "25",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const nextFormat = prefs?.pdf_default_format || "a4";
        const nextMargins = {
            top: String(prefs?.pdf_margin_top ?? 20),
            bottom: String(prefs?.pdf_margin_bottom ?? 20),
            left: String(prefs?.pdf_margin_left ?? 25),
            right: String(prefs?.pdf_margin_right ?? 25),
        };

        setPdfFormat((current) =>
            current === nextFormat ? current : nextFormat,
        );
        setMargins((current) => {
            const sameMargins =
                current.top === nextMargins.top &&
                current.bottom === nextMargins.bottom &&
                current.left === nextMargins.left &&
                current.right === nextMargins.right;

            return sameMargins ? current : nextMargins;
        });
    }, [prefs]);

    const handleSavePdf = async () => {
        if (!token) return;
        setSaving(true);
        try {
            await updateUser.mutateAsync({
                preferences: {
                    pdf_default_format: pdfFormat,
                    pdf_margin_top: Number(margins.top),
                    pdf_margin_bottom: Number(margins.bottom),
                    pdf_margin_left: Number(margins.left),
                    pdf_margin_right: Number(margins.right),
                },
            });
            toast.success("Configurações de PDF salvas com sucesso!");
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Erro ao salvar configurações de PDF",
            );
        } finally {
            setSaving(false);
        }
    };

    return {
        pdfFormat,
        setPdfFormat,
        margins,
        setMargins,
        saving,
        handleSavePdf,
    };
}
