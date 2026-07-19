import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { Colors, Spacing, Sizes, Typography, Shadows } from '../../theme/theme';
import Header from '../../components/Header';
import SearchBar from '../../components/Inputs';
import { MatchCard } from '../../components/Cards';
import BottomSheet from '../../components/BottomSheet';
import EmptyState from '../../components/EmptyState';

type SortOption = 'newest' | 'name' | 'age';

export const MatchesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { matches } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [filterVisible, setFilterVisible] = useState(false);
  const [religionFilter, setReligionFilter] = useState<string>('All');

  // List of unique religions in matches for the filter panel
  const religionOptions = ['All', 'Hindu', 'Sikh', 'Muslim', 'Christian', 'Jain'];

  // Apply search query, filters, and sort options
  const processedMatches = useMemo(() => {
    let result = [...matches];

    // 1. Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) => 
          m.profile.name.toLowerCase().includes(q) || 
          m.profile.profession.toLowerCase().includes(q)
      );
    }

    // 2. Religion Filter
    if (religionFilter !== 'All') {
      result = result.filter((m) => m.profile.religion === religionFilter);
    }

    // 3. Sort options
    result.sort((a, b) => {
      if (sortOption === 'name') {
        return a.profile.name.localeCompare(b.profile.name);
      } else if (sortOption === 'age') {
        return a.profile.age - b.profile.age;
      } else {
        // newest - by default matchedAt or array order (since mock array is ordered newest first)
        return 0; // maintain original array ordering
      }
    });

    return result;
  }, [matches, searchQuery, religionFilter, sortOption]);

  const renderFilterOptions = () => (
    <View style={styles.filterSheetContent}>
      <Text style={styles.filterSheetTitle}>Filter Matches</Text>
      
      <Text style={styles.filterLabel}>Religion</Text>
      <View style={styles.filterOptionsGrid}>
        {religionOptions.map((religion) => {
          const isSelected = religionFilter === religion;
          return (
            <TouchableOpacity
              key={religion}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => setReligionFilter(religion)}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                {religion}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity 
        style={styles.applyFilterBtn} 
        onPress={() => setFilterVisible(false)}
      >
        <Text style={styles.applyFilterBtnText}>Apply Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Matches" />

      <View style={styles.searchBarWrapper}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => setFilterVisible(true)}
        />
      </View>

      {/* Sort row */}
      <View style={styles.sortRow}>
        <Text style={styles.resultsCount}>
          {processedMatches.length} mutual matches
        </Text>
        <View style={styles.sortOptions}>
          <TouchableOpacity 
            style={[styles.sortBtn, sortOption === 'newest' && styles.sortBtnActive]} 
            onPress={() => setSortOption('newest')}
          >
            <Text style={[styles.sortBtnText, sortOption === 'newest' && styles.sortBtnTextActive]}>
              Newest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortBtn, sortOption === 'name' && styles.sortBtnActive]} 
            onPress={() => setSortOption('name')}
          >
            <Text style={[styles.sortBtnText, sortOption === 'name' && styles.sortBtnTextActive]}>
              Name
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortBtn, sortOption === 'age' && styles.sortBtnActive]} 
            onPress={() => setSortOption('age')}
          >
            <Text style={[styles.sortBtnText, sortOption === 'age' && styles.sortBtnTextActive]}>
              Age
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid of matched users */}
      {processedMatches.length > 0 ? (
        <FlatList
          data={processedMatches}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.listColumnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MatchCard
              profile={item.profile}
              matchedAt={item.matchedAt}
              onPress={() => {
                // Navigate to Chatroom as profile detail fallback or chat directly
                navigation.navigate('ChatRoom', {
                  chatId: `chat_${item.profile.id}`,
                  profileName: item.profile.name,
                  profileAvatar: item.profile.imageUrl,
                });
              }}
              onChatPress={() => {
                navigation.navigate('ChatRoom', {
                  chatId: `chat_${item.profile.id}`,
                  profileName: item.profile.name,
                  profileAvatar: item.profile.imageUrl,
                });
              }}
            />
          )}
        />
      ) : (
        <EmptyState
          icon="heart-dislike-outline"
          title="No Matches Found"
          description="Try removing filters or swiping right on home profiles to create mutual matches."
          actionTitle={searchQuery || religionFilter !== 'All' ? "Reset Filters" : undefined}
          onActionPress={() => {
            setSearchQuery('');
            setReligionFilter('All');
          }}
        />
      )}

      {/* Filters sheet */}
      <BottomSheet 
        visible={filterVisible} 
        onClose={() => setFilterVisible(false)}
        height={320}
      >
        {renderFilterOptions()}
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchBarWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  resultsCount: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textSecondary,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sortBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Sizes.radiusSm,
    backgroundColor: '#F3F4F6',
  },
  sortBtnActive: {
    backgroundColor: Colors.secondary,
  },
  sortBtnText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textSecondary,
  },
  sortBtnTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  listColumnWrapper: {
    justifyContent: 'space-between',
  },

  // Filters Sheet Styles
  filterSheetContent: {
    flex: 1,
  },
  filterSheetTitle: {
    ...Typography.heading,
    fontSize: Typography.sizes.h3,
    marginBottom: Spacing.lg,
  },
  filterLabel: {
    ...Typography.heading,
    fontSize: Typography.sizes.bodyLarge,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  filterOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Sizes.radiusMd,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    ...Typography.body,
    fontSize: Typography.sizes.bodyMedium,
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  applyFilterBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Sizes.radiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.soft,
  },
  applyFilterBtnText: {
    ...Typography.heading,
    color: Colors.white,
    fontSize: Typography.sizes.bodyLarge,
  },
});

export default MatchesScreen;
