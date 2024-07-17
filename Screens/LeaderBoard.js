import { Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { theme } from '../constants/theme'
import { collection, query, orderBy, onSnapshot, where, count } from 'firebase/firestore';
import { db } from '../constants/firebaseConfig';
import { FlatList } from 'react-native-gesture-handler';
import LoadingOverlay from '../components/LoadingOverlay';

// Pass this data to tasks for manual testing and change it accordingly
import { testData } from '../constants/testData';

const LeaderBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [countedTasks, setCountedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortByDays, setSortByDays] = useState([]);
  const [sortByWeek, setSortByWeek] = useState([]);
  const [sortByMonth, setSortByMonth] = useState([]);
  const [sortingCount, setSortingCount] = useState(0);
  const color = theme.colors.primaryColor
  const defaultImage = theme.image.defaultImage

  
  // Fetch the tasks and sort them
  const fetchTasks = () => {
    setLoading(true);
    try {
      const tasksCollection = collection(db, 'tasks');
      const q = query(tasksCollection, where('isCompleted', '==', true));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasksArr = [];
        querySnapshot.forEach((doc) => {
          const { uid, name, createdAt, isCompleted } = doc.data();
          tasksArr.push({ uid, name, createdAt, isCompleted, id: doc.id });

        });
        setTasks(tasksArr);
        completedCount(tasksArr, setCountedTasks);
        sortByPeriods();
        setLoading(false)
      });

      return unsubscribe; // Return the unsubscribe function to clean up the listener
    } catch (error) {
      setLoading(false)
      Alert.alert("Error", error.message);
    }
  };


  useEffect(() => {
    const unsubscribe = fetchTasks();
    // Clean up the listener on unmount
    sortByPeriods();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Get completed tasks count for each user
  const completedCount = (tasks, setItems) => {
    const completedTasksCount = tasks.reduce((acc, task) => {
      if (task.isCompleted) {
        if (!acc[task.uid]) {
          acc[task.uid] = {
            uid: task.uid,
            name: task.name,
            createdAt: task.createdAt,
            isCompleted: task.isCompleted,
            count: 1
          };
        } else {
          acc[task.uid].count += 1; // Increment the count
        }
      }
      return acc;
    }, {});

    // Convert the accumulator object to an array
    let resultArray = Object.values(completedTasksCount);
    resultArray = resultArray.sort((a, b) => b.count - a.count);

    setItems(resultArray);
  }

  const sortByPeriods = () => {
    let daysSorted = [];
    let monthsSorted = [];
    let weekSorted = [];
    tasks.map(task => {
      let date = new Date();
      let date2 = new Date(task.createdAt);

      // check if a task is created at same month and same year
      if ((date.getMonth() === date2.getMonth()) && (date.getFullYear() === date2.getFullYear())) {
        monthsSorted.push(task);
      }

      // check if a task is created on same day, same month, same year
      if ((date.getMonth() === date2.getMonth()) && (date.getFullYear() === date2.getFullYear()) && (date.getDay() === date2.getDay())) {
        daysSorted.push(task);
      }

      // Making the custom getWeek function in date function
      Date.prototype.getWeek = function () {
        var dt = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - dt) / 86400000) + dt.getDay() + 1) / 7);
      };

      if ((date.getMonth() === date2.getMonth()) && (date.getFullYear() === date2.getFullYear()) && (date.getWeek() === date2.getWeek())) {
        weekSorted.push(task);
      }

      completedCount(daysSorted, setSortByDays);
      completedCount(weekSorted, setSortByWeek);
      completedCount(monthsSorted, setSortByMonth);

    })


  }
  
  // function for rendering item in flatlist for tasks
  const renderItems = ({ item, index }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: color, paddingVertical: responsiveHeight(1), width: '90%', alignSelf: "center", borderRadius: 12, margin: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: responsiveFontSize(2), color: 'white', paddingRight: 8 }}>{index + 1}.</Text>
        <Image style={[styles.profileIcon, { width: responsiveHeight(6), height: responsiveHeight(6) }]} source={{ uri: 'https://picsum.photos/200' }} />
        <View style={{ width: '70%', paddingHorizontal: responsiveWidth(2) }}>
          <Text style={[{ fontSize: responsiveFontSize(2), color: 'white', fontWeight: 'bold' }]}>{item.name}</Text>
        </View>
      </View>
      <View>
        <Text style={{ fontSize: responsiveFontSize(2), color: 'white', fontWeight: 'bold' }}>{item.count}</Text>
      </View>
    </View>
  )
  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: color }}>
        <View style={styles.topContainer}>
          <Text style={{ fontSize: responsiveFontSize(4), color: 'white', fontWeight: 'bold' }}>Leaderboard</Text>
          <TouchableOpacity onPress={fetchTasks} style={styles.rightButton}>
            <Text>Refresh</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', padding: 15 }}>
          <Text style={{ textAlign: 'center', color: 'white', fontSize: responsiveFontSize(2) }}>Sort:</Text>
          <TouchableOpacity onPress={() => setSortingCount(0)} style={[styles.filterbtn, sortingCount === 0 ? { backgroundColor: 'white' } : { backgroundColor: color }]}>
            <Text style={[sortingCount === 0 ? { color } : { color: 'white' }, { fontWeight: 'bold', textAlign: 'center' }]}>  All  </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortingCount(1)} style={[styles.filterbtn, sortingCount === 1 ? { backgroundColor: 'white' } : { backgroundColor: color }]}>
            <Text style={[sortingCount === 1 ? { color } : { color: 'white' }, { fontWeight: 'bold', textAlign: 'center' }]}>Day</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortingCount(2)} style={[styles.filterbtn, sortingCount === 2 ? { backgroundColor: 'white' } : { backgroundColor: color }]}>
            <Text style={[sortingCount === 2 ? { color } : { color: 'white' }, { fontWeight: 'bold', textAlign: 'center' }]}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortingCount(3)} style={[styles.filterbtn, sortingCount === 3 ? { backgroundColor: 'white' } : { backgroundColor: color }]}>
            <Text style={[sortingCount === 3 ? { color } : { color: 'white' }, { fontWeight: 'bold', textAlign: 'center' }]}>Month</Text>
          </TouchableOpacity>

        </View>
      </View>
      <View>
        <FlatList
          data={sortingCount === 0 ? countedTasks : sortingCount === 1 ? sortByDays : sortingCount === 2 ? sortByWeek : sortingCount === 3 ? sortByMonth : []}
          renderItem={renderItems}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={{paddingVertical:20}}
        >

        </FlatList>

        <LoadingOverlay loading={loading} message="Loading..." />
      </View>
    </View>
  )
}

export default LeaderBoard

const styles = StyleSheet.create({
  profileIcon: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(7) / 2,
    borderWidth: 2,
    // borderColor:secondaryColor,
  },
  topContainer:{ 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: theme.colors.primaryColor, 
    paddingHorizontal: responsiveWidth(4), 
    paddingVertical: responsiveHeight(2) 
  },
  rightButton:{ backgroundColor: 'white', 
    padding: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 10 
  },
  filterbtn:{ 
    padding: 10, 
    borderWidth: 1, 
    borderColor: "white", 
    borderRadius: 20 
  }
})