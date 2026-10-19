// Only a visitor's explicit contact/enquiry request can show the contact button.
export function wantsContact(text) {
  const value = text.toLowerCase().replace(/[’]/g, "'");
  if (/\b(?:don't|do not|dont|not ready to|not looking to|stop|cancel|no need to)\b.{0,45}\b(?:contact|call|email|reach|enquir|inquir|touch|start|begin|hire|work)/.test(value)) return false;
  return /\b(?:contact|enquiry|enquiries|inquiry|inquiries|enquire|inquire|reach out|get in touch|getting in touch|callback|call back)\b/.test(value)
    || /\b(?:reach|connect with|speak (?:to|with)|talk (?:to|with)|message|email|call)\s+(?:to\s+)?(?:you|someone|somebody|a human|a person|a representative|an agent|(?:the|your) (?:sales |support )?team|growthway|me)\b/.test(value)
    || /\b(?:phone number|telephone number|email address|contact form|send (?:you |a |an )?(?:message|enquiry|inquiry)|request (?:a )?(?:quote|quotation|consultation|meeting|call))\b/.test(value)
    || /\b(?:book|schedule|arrange)\b.{0,25}\b(?:call|meeting|consultation)\b/.test(value)
    || /\b(?:start|begin|kick off)\s+(?:(?:a|my|our|the|new)\s+){0,2}project\b/.test(value)
    || /\b(?:get started|start working|work|partner|collaborate)\s+with\s+(?:you|growthway|your team)\b/.test(value)
    || /\b(?:hire|engage)\s+(?:you|growthway|your team)\b/.test(value)
    || /\bhow\s+(?:do|can|could)\s+(?:i|we)\s+get started\b/.test(value);
}

export function contactReply(text) {
  return wantsContact(text) ? {
    role: 'assistant',
    content: 'Sure! You can reach the Growthway team by filling out the contact form below.',
    cta: '/contact',
  } : null;
}
