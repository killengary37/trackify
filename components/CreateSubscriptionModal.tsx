import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { styled } from 'nativewind';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { icons } from '@/constants/icons';

const StyledModal = styled(Modal);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);
const StyledScrollView = styled(ScrollView);

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

const CATEGORIES = [
  'Entertainment',
  'AI Tools',
  'Developer Tools',
  'Design',
  'Productivity',
  'Cloud',
  'Music',
  'Other',
];

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: '#ff6b6b',
  'AI Tools': '#4ecdc4',
  'Developer Tools': '#45b7d1',
  Design: '#f5c542',
  Productivity: '#96ceb4',
  Cloud: '#a8e6cf',
  Music: '#ff8b94',
  Other: '#c7ceea',
};

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [frequency, setFrequency] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [category, setCategory] = useState('');

  const resetForm = () => {
    setName('');
    setPrice('');
    setFrequency('Monthly');
    setCategory('');
  };

  const validateForm = () => {
    const trimmedName = name.trim();
    const numericPrice = parseFloat(price);

    return trimmedName.length > 0 && !isNaN(numericPrice) && numericPrice > 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const numericPrice = parseFloat(price);
    const startDate = new Date().toISOString();
    const renewalDate = frequency === 'Monthly' 
      ? dayjs().add(1, 'month').toISOString()
      : dayjs().add(1, 'year').toISOString();

    const newSubscription: Subscription = {
      id: `subscription-${Date.now()}`,
      name: name.trim(),
      price: numericPrice,
      category: category || 'Other',
      status: 'active',
      startDate,
      renewalDate,
      icon: icons.wallet,
      billing: frequency,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
      currency: 'USD',
    };

    onSubmit(newSubscription);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <StyledModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <StyledKeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StyledPressable className="modal-overlay" onPress={handleClose}>
          <StyledPressable
            className="modal-container"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <StyledView className="modal-header">
              <StyledText className="modal-title">New Subscription</StyledText>
              <StyledPressable className="modal-close" onPress={handleClose}>
                <StyledText className="modal-close-text">×</StyledText>
              </StyledPressable>
            </StyledView>

            {/* Body */}
            <StyledScrollView className="modal-body">
              {/* Name Field */}
              <StyledView className="auth-field">
                <StyledText className="auth-label">Name</StyledText>
                <StyledTextInput
                  className="auth-input"
                  placeholder="Enter subscription name"
                  placeholderTextColor="#666"
                  value={name}
                  onChangeText={setName}
                />
              </StyledView>

              {/* Price Field */}
              <StyledView className="auth-field">
                <StyledText className="auth-label">Price</StyledText>
                <StyledTextInput
                  className="auth-input"
                  placeholder="0.00"
                  placeholderTextColor="#666"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </StyledView>

              {/* Frequency Field */}
              <StyledView className="auth-field">
                <StyledText className="auth-label">Frequency</StyledText>
                <StyledView className="picker-row">
                  <StyledPressable
                    className={clsx(
                      'picker-option',
                      frequency === 'Monthly' && 'picker-option-active'
                    )}
                    onPress={() => setFrequency('Monthly')}
                  >
                    <StyledText
                      className={clsx(
                        'picker-option-text',
                        frequency === 'Monthly' && 'picker-option-text-active'
                      )}
                    >
                      Monthly
                    </StyledText>
                  </StyledPressable>
                  <StyledPressable
                    className={clsx(
                      'picker-option',
                      frequency === 'Yearly' && 'picker-option-active'
                    )}
                    onPress={() => setFrequency('Yearly')}
                  >
                    <StyledText
                      className={clsx(
                        'picker-option-text',
                        frequency === 'Yearly' && 'picker-option-text-active'
                      )}
                    >
                      Yearly
                    </StyledText>
                  </StyledPressable>
                </StyledView>
              </StyledView>

              {/* Category Field */}
              <StyledView className="auth-field">
                <StyledText className="auth-label">Category</StyledText>
                <StyledView className="category-scroll">
                  {CATEGORIES.map((cat) => (
                    <StyledPressable
                      key={cat}
                      className={clsx(
                        'category-chip',
                        category === cat && 'category-chip-active'
                      )}
                      onPress={() => setCategory(cat)}
                    >
                      <StyledText
                        className={clsx(
                          'category-chip-text',
                          category === cat && 'category-chip-text-active'
                        )}
                      >
                        {cat}
                      </StyledText>
                    </StyledPressable>
                  ))}
                </StyledView>
              </StyledView>

              {/* Submit Button */}
              <StyledPressable
                className={clsx(
                  'auth-button',
                  !validateForm() && 'auth-button-disabled'
                )}
                onPress={handleSubmit}
                disabled={!validateForm()}
              >
                <StyledText className="auth-button-text">
                  Create Subscription
                </StyledText>
              </StyledPressable>
            </StyledScrollView>
          </StyledPressable>
        </StyledPressable>
      </StyledKeyboardAvoidingView>
    </StyledModal>
  );
}
