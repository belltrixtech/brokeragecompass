// Alternative PDF Generation Approach (Fallback)
// This creates PDF directly from data without html2canvas

const generatePDFDirectly = (results, calculationData) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text
  const addText = (text, size = 12, style = 'normal') => {
    pdf.setFontSize(size);
    pdf.setFont('helvetica', style);
    pdf.text(text, margin, yPosition);
    yPosition += (size * 0.5) + 2;
  };

  // Header
  addText('Brokerage Comparison Report', 20, 'bold');
  addText(`Generated on ${new Date().toLocaleDateString()}`, 10);
  yPosition += 10;

  // Agent Profile
  addText('Agent Profile', 16, 'bold');
  addText(`Annual GCI: $${calculationData.gci?.toLocaleString()}`);
  addText(`Transactions: ${calculationData.transactions}`);
  addText(`Recruited Agents: ${calculationData.recruits || 0}`);
  yPosition += 10;

  // Results Table
  addText('Brokerage Comparison', 16, 'bold');
  
  results.forEach((result, index) => {
    if (yPosition > 250) { // Start new page if needed
      pdf.addPage();
      yPosition = margin;
    }
    
    addText(`${index + 1}. ${result.brokerage.name}`, 12, 'bold');
    addText(`   Total Income: $${result.totalAnnualIncome.toLocaleString()}`);
    addText(`   Commission: $${(result.netIncome - result.totalFees).toLocaleString()}`);
    addText(`   Revenue Share: $${result.revenueShareIncome.toLocaleString()}`);
    addText(`   Stock Awards: $${result.stockAwardIncome.toLocaleString()}`);
    yPosition += 5;
  });

  // Save
  const agentGCI = parseFloat(calculationData.gci).toLocaleString().replace(/,/g, '');
  const filename = `brokerage-comparison-${agentGCI}-GCI-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
};

// Usage in your component:
// generatePDFDirectly(results, generateCalculationData());