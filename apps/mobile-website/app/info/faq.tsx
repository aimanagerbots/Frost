import { ScrollView, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { SafeScreen, Text, Card } from '@/components';
import { colors } from '@/theme';

const FAQS = [
  { q: 'What are your hours?', a: 'Our hours vary by location. Most stores are open 9am-9pm daily. Check the Store Finder for specific hours.' },
  { q: 'Do I need a medical card?', a: 'No. Oregon allows recreational cannabis sales to anyone 21 and older with valid ID.' },
  { q: 'Do you offer delivery?', a: 'We currently offer in-store pickup only. Place your order online and pick it up at your nearest Frost location.' },
  { q: 'How does the rewards program work?', a: 'Earn 1 point per $1 spent. Points can be redeemed for discounts, merch, and sweepstakes entries. Sign up in the Account tab.' },
  { q: 'What payment methods do you accept?', a: 'We accept cash and debit cards at all locations. Some locations also accept CanPay.' },
  { q: 'Can I return products?', a: 'Due to state regulations, we cannot accept returns on cannabis products. Defective merchandise can be exchanged within 30 days.' },
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Pressable onPress={() => setOpen(!open)} className="mb-2">
      <Card padding="md">
        <View className="flex-row items-center justify-between">
          <Text variant="body" className="flex-1 text-sm font-semibold">{question}</Text>
          {open ? (
            <ChevronUp size={18} color={colors.text.muted} />
          ) : (
            <ChevronDown size={18} color={colors.text.muted} />
          )}
        </View>
        {open && (
          <Text variant="body" className="text-text-muted text-sm mt-3">
            {answer}
          </Text>
        )}
      </Card>
    </Pressable>
  );
}

export default function FaqScreen() {
  const router = useRouter();

  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">FAQ</Text>
      </View>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {FAQS.map((faq, i) => (
          <AccordionItem key={i} question={faq.q} answer={faq.a} />
        ))}
        <View className="h-8" />
      </ScrollView>
    </SafeScreen>
  );
}
