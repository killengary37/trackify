import {Text, TextInput, FlatList, View} from "react-native"
import {SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useState } from "react";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptions } from "@/contexts/SubscriptionsContext";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const { subscriptions } = useSubscriptions();

    // Filter subscriptions based on search query
    const filteredSubscriptions = subscriptions.filter(subscription =>
        subscription.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subscription.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subscription.plan?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCardPress = (subscriptionId: string) => {
        setExpandedCard(expandedCard === subscriptionId ? null : subscriptionId);
    };

    const renderSubscriptionCard = ({ item }: { item: Subscription }) => (
        <SubscriptionCard
            {...item}
            expanded={expandedCard === item.id}
            onPress={() => handleCardPress(item.id)}
        />
    );

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-2xl font-bold text-foreground mb-4">Subscriptions</Text>

            <TextInput
                className="bg-card border border-border rounded-lg px-4 py-3 mb-4 text-foreground"
                placeholder="Search subscriptions..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <FlatList
                data={filteredSubscriptions}
                renderItem={renderSubscriptionCard}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                ItemSeparatorComponent={() => <View className="h-3" />}
            />
        </SafeAreaView>
    )
}
export default Subscriptions
