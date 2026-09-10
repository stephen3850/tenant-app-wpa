"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Building } from "lucide-react";
import {
  getCollectionSettingsAction,
  updateCollectionSettingsAction,
  updateCollectionSmsSettingsAction
} from "@/features/workspace/actions/collection-setting-actions";

export function CollectionsView({ onOpenProfile }: { onOpenProfile?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingSms, setSavingSms] = useState(false);

  const [gracePeriod, setGracePeriod] = useState("0");
  const [upcomingDue, setUpcomingDue] = useState("5,3,1");
  const [overdueDays, setOverdueDays] = useState("1,3,7,14,30");
  const [autoEscalate, setAutoEscalate] = useState("60");

  const [enableSms, setEnableSms] = useState(false);
  const [firstSendDay, setFirstSendDay] = useState("16");
  const [repeatDays, setRepeatDays] = useState("3");

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getCollectionSettingsAction();
        if (settings) {
          setGracePeriod(settings.gracePeriod.toString());
          setUpcomingDue(settings.upcomingDueDays);
          setOverdueDays(settings.overdueDays);
          setAutoEscalate(settings.autoEscalateAfter.toString());
          setEnableSms(settings.enableBalanceSms);
          setFirstSendDay(settings.firstSendDay.toString());
          setRepeatDays(settings.repeatEvery.toString());
        }
      } catch (error) {
        console.error("Failed to load collection settings:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveCollections = async () => {
    setSavingSettings(true);
    try {
      await updateCollectionSettingsAction({
        gracePeriod: parseInt(gracePeriod) || 0,
        upcomingDueDays: upcomingDue,
        overdueDays: overdueDays,
        autoEscalateAfter: parseInt(autoEscalate) || 0,
      });
      toast.success("Collection reminders updated successfully");
    } catch (error) {
      toast.error("Failed to save collection settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveSms = async () => {
    setSavingSms(true);
    try {
      await updateCollectionSmsSettingsAction({
        enableBalanceSms: enableSms,
        firstSendDay: parseInt(firstSendDay) || 1,
        repeatEvery: parseInt(repeatDays) || 1,
      });
      toast.success("Outstanding balance SMS settings updated");
    } catch (error) {
      toast.error("Failed to save SMS settings");
    } finally {
      setSavingSms(false);
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-[26px] font-bold text-[#1A202C] tracking-tight leading-tight">Collections Reminders</h2>
          <p className="text-[14px] text-slate-500 font-medium tracking-tight">
            Configure collections cadence and outstanding balance SMS.
          </p>
        </div>
        <Button
          onClick={onOpenProfile}
          className="bg-[#2D3748] hover:bg-[#1A202C] text-white px-4 h-10 rounded-lg gap-2 font-bold text-[12px] shadow-sm"
        >
          <Building className="h-4 w-4" />
          Business profile
        </Button>
      </div>

      {/* Collections Reminders Section */}
      <Card className="border-slate-100 shadow-none bg-white rounded-2xl p-8 border">
        <div className="space-y-8">
          <div className="space-y-1">
            <h3 className="text-[17px] font-bold text-[#1A202C] tracking-tight">Collections reminders</h3>
            <p className="text-[13px] text-slate-500 font-medium tracking-tight">
              Configure when the system sends upcoming-due, overdue, promise-to-pay, and escalation reminders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-slate-700">Grace period (days)</Label>
              <Input
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)}
                className="h-11 text-[14px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-lg"
              />
              <p className="text-[11px] text-slate-400 font-medium">Invoice becomes overdue after due date + grace period.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-slate-700">Upcoming due (days before)</Label>
              <Input
                value={upcomingDue}
                onChange={(e) => setUpcomingDue(e.target.value)}
                className="h-11 text-[14px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-lg"
              />
              <p className="text-[11px] text-slate-400 font-medium">Comma list. Example: 5,3,1 sends 5/3/1 days before due.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-slate-700">Overdue (days after)</Label>
              <Input
                value={overdueDays}
                onChange={(e) => setOverdueDays(e.target.value)}
                className="h-11 text-[14px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-lg"
              />
              <p className="text-[11px] text-slate-400 font-medium">Comma list. Example: 1,3,7 sends after overdue starts.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-slate-700">Auto-escalate after (days overdue)</Label>
              <Input
                value={autoEscalate}
                onChange={(e) => setAutoEscalate(e.target.value)}
                className="h-11 text-[14px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-lg"
              />
              <p className="text-[11px] text-slate-400 font-medium">Set 0 to disable auto-escalation.</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveCollections}
              disabled={savingSettings}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold h-11 px-10 rounded-xl text-[14px] shadow-sm"
            >
              {savingSettings ? "Saving..." : "Save collections settings"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Outstanding balance SMS Section */}
      <Card className="border-slate-100 shadow-none bg-white rounded-2xl p-8 border">
        <div className="space-y-8">
          <div className="space-y-1">
            <h3 className="text-[17px] font-bold text-[#1A202C] tracking-tight">Outstanding balance SMS</h3>
            <p className="text-[13px] text-slate-500 font-medium tracking-tight leading-relaxed">
              Send SMS to tenants whose total statement balance is above zero. This is disabled by default for every business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="enableSms"
                    checked={enableSms}
                    onCheckedChange={(v) => setEnableSms(!!v)}
                    className="h-5 w-5 border-slate-300 data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]"
                  />
                  <Label htmlFor="enableSms" className="text-[14px] font-bold text-slate-700 cursor-pointer">
                    Enable outstanding balance SMS
                  </Label>
                </div>
                <p className="text-[11px] text-slate-400 font-medium max-w-sm leading-relaxed">
                  Uses the saved SMS provider credentials even when general SMS is disabled.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-slate-700">Repeat every (days)</Label>
                <Input
                  value={repeatDays}
                  onChange={(e) => setRepeatDays(e.target.value)}
                  className="h-11 text-[14px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-lg"
                />
                <p className="text-[11px] text-slate-400 font-medium">Use 3 to repeat every three days.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-slate-700">First send day of month</Label>
              <Input
                value={firstSendDay}
                onChange={(e) => setFirstSendDay(e.target.value)}
                className="h-11 text-[14px] border-slate-200 focus-visible:ring-[#3B82F6] rounded-lg"
              />
              <p className="text-[11px] text-slate-400 font-medium">Use 16 for reminders after the 15th.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-8 border-t border-slate-50 gap-4">
            <span className="text-[13px] text-slate-400 font-medium">{enableSms ? "Enabled" : "Disabled"}</span>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="bg-[#2D3748] hover:bg-[#1A202C] text-white border-none font-bold h-11 px-8 rounded-xl text-[13px]">
                Test SMS
              </Button>
              <Button variant="outline" className="bg-[#2D3748] hover:bg-[#1A202C] text-white border-none font-bold h-11 px-8 rounded-xl text-[13px]">
                Edit SMS template
              </Button>
              <Button
                onClick={handleSaveSms}
                disabled={savingSms}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold h-11 px-8 rounded-xl text-[13px] shadow-sm"
              >
                {savingSms ? "Saving..." : "Save outstanding SMS settings"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="h-10" />
    </div>
  );
}
