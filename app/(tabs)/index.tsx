import "@/global.css"

import {FlatList, Image, Text, View, Pressable} from "react-native";
import {SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images";
import {HOME_BALANCE, HOME_USER, UPCOMING_SUBSCRIPTIONS} from "@/constants/data";
import {icons} from "@/constants/icons";
import {formatCurrency} from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import {useState} from "react";
import { useSubscriptions } from "@/contexts/SubscriptionsContext";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { subscriptions, addSubscription } = useSubscriptions();

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleAddSubscription = (newSubscription: Subscription) => {
        addSubscription(newSubscription);
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-5">

                <FlatList
                    ListHeaderComponent={() => (
                        <>
                            <View className="home-header">
                                <View className="home-user">
                                    <Image source={images.avatar} className="home-avatar"/>
                                    <Text className="home-user-name">{HOME_USER.name}</Text>
                                </View>

                                <Pressable onPress={handleOpenModal}>
                                    <Image source={icons.add} className="home-add-icon"/>
                                </Pressable>
                            </View>

                            <View className="home-balance-card">
                                <Text className="home-balance-label">Balance</Text>

                                <View className="home-balance-row">
                                    <Text className="home-balance-amount">
                                        {formatCurrency(HOME_BALANCE.amount)}
                                    </Text>
                                    <Text className="home-balance-date">
                                        {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
                                    </Text>
                                </View>
                            </View>

                            <View className="mb-5">
                                <ListHeading title="Upcoming"/>
                                <FlatList
                                    data={UPCOMING_SUBSCRIPTIONS}
                                    renderItem={({ item }) => (
                                        <UpcomingSubscriptionCard {...item} />)}
                                    keyExtractor={(item) => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals yet.</Text>}
                                />
                            </View>

                            <ListHeading title="All Subscriptions"/>
                        </>
                    )}
                    data={subscriptions}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <SubscriptionCard
                           {...item}
                           expanded={expandedSubscriptionId === item.id}
                           onPress={() => setExpandedSubscriptionId((currentId) =>
                               (currentId === item.id ? null : item.id))}
                        />

                    )}
                    extraData={expandedSubscriptionId}
                    ItemSeparatorComponent={() => <View className="h-4"/>}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text className="home-empty-state">No Subscriptions yet</Text>}
                    contentContainerClassName="pb-30"
                />

            <CreateSubscriptionModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                onSubmit={handleAddSubscription}
            />
        </SafeAreaView>
    );
}
