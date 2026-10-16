"use client";

import React, { useState } from "react";
import { MOCK_INSTRUMENTS } from "@/lib/mock-data/samples";
import { LabInstrument } from "@/lib/types/sample";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Gauge, CheckCircle2, AlertTriangle, XCircle, Wrench, ShieldCheck } from "lucide-react";

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState<LabInstrument[]>(MOCK_INSTRUMENTS);
  const [selectedInst, setSelectedInst] = useState<LabInstrument | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenCalibrate = (inst: LabInstrument) => {
    setSelectedInst(inst);
    setModalOpen(true);
  };

  const handleConfirmCalibrate = () => {
    if (!selectedInst) return;

    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 3);

    const updated: LabInstrument = {
      ...selectedInst,
      status: "Operational",
      calibrationStatus: "Valid",
      lastCalibrated: new Date().toISOString().slice(0, 10),
      nextCalibrationDue: nextDate.toISOString().slice(0, 10),
    };

    setInstruments((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    );
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-xs font-bold text-teal-pharma uppercase tracking-wider">
          Equipment Qualification
        </span>
        <h1 className="font-heading text-2xl font-black text-pharma-blue flex items-center gap-2 mt-0.5">
          <Gauge className="h-6 w-6 text-teal-pharma" />
          Laboratory Instruments & Calibration Log
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Traceable equipment calibration (ISO/IEC 17025 & GMP standards) ensuring analytical instruments maintain certified operational states.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 font-heading text-[11px] font-bold uppercase tracking-wider text-pharma-blue">
              <tr>
                <th className="py-3.5 px-4">Instrument ID</th>
                <th className="py-3.5 px-4">Model & Description</th>
                <th className="py-3.5 px-4">Lab Location</th>
                <th className="py-3.5 px-4">Last Calibration</th>
                <th className="py-3.5 px-4">Next Due Date</th>
                <th className="py-3.5 px-4">Operational State</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {instruments.map((inst) => {
                const isOp = inst.status === "Operational";
                const isDue = inst.status === "Due Soon";

                return (
                  <tr key={inst.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-pharma-blue">
                      {inst.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-xs">
                          {inst.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {inst.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {inst.location}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {inst.lastCalibrated}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span
                        className={
                          isDue
                            ? "text-warning-amber-dark"
                            : isOp
                            ? "text-teal-pharma-dark"
                            : "text-fail-red"
                        }
                      >
                        {inst.nextCalibrationDue}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {isOp && (
                        <Badge variant="pass">
                          <CheckCircle2 className="h-3 w-3" />
                          Operational
                        </Badge>
                      )}
                      {isDue && (
                        <Badge variant="quarantine">
                          <AlertTriangle className="h-3 w-3" />
                          Due Soon
                        </Badge>
                      )}
                      {!isOp && !isDue && (
                        <Badge variant="fail">
                          <XCircle className="h-3 w-3" />
                          Quarantined
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant={isDue ? "teal" : "outline"}
                        size="sm"
                        onClick={() => handleOpenCalibrate(inst)}
                        className="h-7 text-xs font-semibold gap-1"
                      >
                        <Wrench className="h-3 w-3" />
                        Calibrate
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calibration Modal */}
      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              <Wrench className="h-5 w-5 text-pharma-blue" />
              <span>Perform Calibration Check</span>
            </DialogTitle>
          </DialogHeader>

          {selectedInst && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div><strong>Instrument:</strong> {selectedInst.name}</div>
                <div><strong>ID:</strong> <code className="font-mono">{selectedInst.id}</code></div>
                <div><strong>Location:</strong> {selectedInst.location}</div>
                <div><strong>Responsible:</strong> {selectedInst.responsibleChemist}</div>
              </div>

              <p className="text-slate-600">
                Registering this routine standard check confirms that the instrument has been calibrated against NIST/ISO traceable reference standards. Calibration validity will be extended by 90 days.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" size="sm" onClick={handleConfirmCalibrate} className="gap-1 font-bold">
              <ShieldCheck className="h-4 w-4" />
              Verify & Extend Certification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
