interface BrokerageDisclaimerProps {
  brokerageName: string
  lastUpdated: string
  sourceUrl?: string
}

export default function BrokerageDisclaimer({ brokerageName, lastUpdated, sourceUrl }: BrokerageDisclaimerProps) {
  return (
    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-start space-x-3">
        <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-800">Important Disclaimer</h4>
          <div className="mt-2 text-sm text-amber-700 space-y-1">
            <p>This calculator is based on {brokerageName} fee structures from official documentation (last updated: {lastUpdated}) and should only be used as an estimate.</p>
            <p><strong>This is not an official {brokerageName} cost calculator.</strong></p>
            <p>Actual costs may vary based on:</p>
            <ul className="list-disc ml-4 space-y-0.5">
              <li>Team structures and special agreements</li>
              <li>State-specific requirements and fees</li>
              <li>Individual production levels and timing</li>
              <li>Stock awards and special programs not calculated</li>
            </ul>
            <p className="font-medium">Always verify final numbers directly with {brokerageName} before making decisions.</p>
            {sourceUrl && (
              <p className="text-xs">
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  View official fee documentation
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

