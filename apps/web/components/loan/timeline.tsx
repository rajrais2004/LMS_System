'use client';

const steps = [
  { key: 'BRE', label: 'BRE evaluation' },
  { key: 'SLIP', label: 'Slip upload' },
  { key: 'APPLIED', label: 'Loan applied' },
  { key: 'SANCTIONED', label: 'Sanction' },
  { key: 'DISBURSED', label: 'Disbursed' },
  { key: 'CLOSED', label: 'Closed' },
];

type LoanTimelineProps = {
  current?: string;
  application?: any;
  loan?: any;
};

function getCompletedSteps(application?: any, loan?: any) {
  const completed = new Set<string>();

  if (application?.breApproved) {
    completed.add('BRE');
  }

  if (application?.slipUrl) {
    completed.add('SLIP');
  }

  if (loan) {
    completed.add('APPLIED');
  }

  if (
    loan?.status === 'SANCTIONED' ||
    loan?.status === 'DISBURSED' ||
    loan?.status === 'CLOSED'
  ) {
    completed.add('SANCTIONED');
  }

  if (
    loan?.status === 'DISBURSED' ||
    loan?.status === 'CLOSED'
  ) {
    completed.add('DISBURSED');
  }

  if (loan?.status === 'CLOSED') {
    completed.add('CLOSED');
  }

  return completed;
}

export function LoanTimeline({
  application,
  loan,
}: LoanTimelineProps) {
  const completed = getCompletedSteps(application, loan);

  return (
    <div className="space-y-6 rounded-3xl border border-slate-800/90 bg-slate-900/90 p-6">
      <h2 className="text-lg font-semibold text-white">
        Loan lifecycle
      </h2>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completed.has(step.key);

          return (
            <div key={step.key} className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                  isCompleted
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-slate-700 text-slate-400'
                }`}
              >
                {index + 1}
              </div>

              <div>
                <p
                  className={`text-sm font-medium ${
                    isCompleted
                      ? 'text-white'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>

                <p
                  className={`text-xs ${
                    isCompleted
                      ? 'text-cyan-400'
                      : 'text-slate-500'
                  }`}
                >
                  {isCompleted ? 'Completed' : 'Pending'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}