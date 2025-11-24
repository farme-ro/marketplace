/**
 * Commission FAQ Section
 * 
 * Secțiunea cu întrebări frecvente despre comisioane
 */

'use client'

import { Card, CardContent } from 'farme-ui'

export function CommissionFaqSection() {
  const faqs = [
    {
      question: 'De ce există comision și nu este 0%?',
      answer:
        'Farme.ro are costuri reale: infrastructură tehnică, plăți, dezvoltare, moderare, suport, marketing. Comisionul ne permite să ținem platforma în viață, să o îmbunătățim și să aducem clienți noi către tine.',
    },
    {
      question: 'Ce se întâmplă dacă într-o lună vând mai puțin?',
      answer:
        'Dacă volumul scade, poți reveni pe un nivel de comision de bază pentru luna respectivă. Nu există penalizări ascunse – doar un model transparent, pe praguri de vânzări.',
    },
    {
      question: 'Cum aflu când mi-a scăzut comisionul?',
      answer:
        'În versiunea completă, vei vedea comisionul actual afișat clar în contul tău și vei primi notificări când ajungi la un nou prag. Momentan, această pagină explică principiul și modelul propus.',
    },
    {
      question: 'Sunt blocat într-un contract pe termen lung?',
      answer:
        'Nu. Nu vrem să te ținem captiv. Vrem să rămâi pentru că îți este bine, nu pentru că nu poți pleca. Poți întrerupe colaborarea, dar îți recomandăm să păstrezi contul activ pentru a nu pierde recenziile și reputația.',
    },
    {
      question: 'Ce rol au abonamentele pentru producători?',
      answer:
        'Abonamentele îți oferă mai multă vizibilitate, unelte extra și acces mai bun la clienți. Comisionul rămâne transparent, iar abonamentul este o opțiune – nu o obligație.',
    },
  ]

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Întrebări frecvente
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            className="border border-border rounded-[32px] shadow-premium bg-card"
          >
            <CardContent className="p-5 md:p-6">
              <p className="text-sm font-semibold text-foreground mb-2">
                {faq.question}
              </p>
              <p className="text-xs text-foreground-body leading-relaxed">
                {faq.answer}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

