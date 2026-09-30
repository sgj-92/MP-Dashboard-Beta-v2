// ===================== BASE (immutable historical) DATA =====================
const BASE_MATCHES = [{"date":"2026-07-02","winners":["Len","Eli"],"losers":["Shaun","Osh"],"sets":[[0,6],[6,3],[6,4]],"type":"doubles","note":"","id":"base_0","verified":true},{"date":"2026-07-02","winners":["Dennis","Osh"],"losers":["KC","Eli"],"sets":[[7,5],[6,2]],"type":"doubles","note":"","id":"base_1","verified":true},{"date":"2026-07-02","winners":["Tee","MK"],"losers":["Rhys","Fee"],"sets":[[6,0],[6,2]],"type":"doubles","note":"","id":"base_2","verified":true},{"date":"2026-07-02","winners":["KC","Shaun"],"losers":["Osh","Carla"],"sets":[[6,4],[6,3],[6,4]],"type":"doubles","note":"","id":"base_3","verified":true},{"date":"2026-07-03","winners":["Osh"],"losers":["Len"],"sets":[[15,13],[15,11]],"type":"singles","note":"","id":"base_4","verified":true},{"date":"2026-07-03","winners":["Eli","Fatch"],"losers":["Stormzy","Omar"],"sets":[[6,4],[6,3]],"type":"doubles","note":"","id":"base_5","verified":true},{"date":"2026-07-05","winners":["Len","Eli"],"losers":["Erf","Max"],"sets":[[3,6],[6,2],[6,3]],"type":"doubles","note":"","id":"base_6","verified":true},{"date":"2026-07-05","winners":["Erf","Eli"],"losers":["Len","Max"],"sets":[[6,4],[6,2]],"type":"doubles","note":"","id":"base_7","verified":true},{"date":"2026-07-05","winners":["Erf","Len"],"losers":["Max","Eli"],"sets":[[6,1],[5,0]],"type":"doubles","note":"walkover/forfeit","id":"base_8","verified":true},{"date":"2026-07-06","winners":["Stormzy","Osh"],"losers":["Max","Len"],"sets":[[6,4],[6,3]],"type":"doubles","note":"","id":"base_9","verified":true},{"date":"2026-07-07","winners":["Erf","Osh"],"losers":["Len","Eli"],"sets":[[6,2],[7,5]],"type":"doubles","note":"","id":"base_10","verified":true},{"date":"2026-07-08","winners":["Rishi","Max"],"losers":["Harry","Shaun"],"sets":[[7,5],[7,5]],"type":"doubles","note":"","id":"base_11","verified":true},{"date":"2026-07-08","winners":["Rishi","Harry"],"losers":["Max","Shaun"],"sets":[[6,7],[6,4],[7,5]],"type":"doubles","note":"","id":"base_12","verified":true},{"date":"2026-07-09","winners":["Harry","Omar"],"losers":["Max","Rishi"],"sets":[[6,3],[7,6]],"type":"doubles","note":"","id":"base_13","verified":true},{"date":"2026-07-10","winners":["Eli","Erf"],"losers":["Kaz","Max"],"sets":[[4,6],[6,1],[6,1]],"type":"doubles","note":"","id":"base_14","verified":true},{"date":"2026-07-12","winners":["Erf","Rishi"],"losers":["PDM","Eli"],"sets":[[6,3],[6,3]],"type":"doubles","note":"","id":"base_15","verified":true},{"date":"2026-07-12","winners":["Manny","Kaz"],"losers":["Osh","Dennis"],"sets":[[6,1],[6,0]],"type":"doubles","note":"","id":"base_16","verified":true},{"date":"2026-07-12","winners":["Manny","Dennis"],"losers":["Osh","Kaz"],"sets":[[6,4],[6,3]],"type":"doubles","note":"","id":"base_17","verified":true},{"date":"2026-07-12","winners":["Eli","Len"],"losers":["Rishi","Osh"],"sets":[[7,5],[5,7],[7,5]],"type":"doubles","note":"","id":"base_18","verified":true},{"date":"2026-07-13","winners":["Jords","Kaz"],"losers":["Erf","Rishi"],"sets":[[6,4],[6,4],[6,3]],"type":"doubles","note":"","id":"base_19","verified":true},{"date":"2026-07-13","winners":["Harry","Antz"],"losers":["Shaun","Rocky"],"sets":[[4,6],[6,4],[9,8]],"type":"doubles","note":"3rd set tie-break","id":"base_20","verified":true},{"date":"2026-07-13","winners":["Jams","Rishi"],"losers":["Fatch","Jords"],"sets":[[6,3],[7,5]],"type":"doubles","note":"","id":"base_21","verified":true},{"date":"2026-07-14","winners":["KC","Erf"],"losers":["Osh","Dennis"],"sets":[[2,6],[6,1],[6,2]],"type":"doubles","note":"","id":"base_22","verified":true},{"date":"2026-07-15","winners":["Rishi","Antz"],"losers":["Jords","MK"],"sets":[[1,6],[6,3],[6,0]],"type":"doubles","note":"","id":"base_23","verified":true},{"date":"2026-07-15","winners":["Kaz","Rishi"],"losers":["Max","Erf"],"sets":[[6,4],[6,3]],"type":"doubles","note":"","id":"base_24","verified":true},{"date":"2026-07-16","winners":["Max","PDM"],"losers":["Rishi","Jords"],"sets":[[7,6],[7,6]],"type":"doubles","note":"","id":"base_25","verified":true},{"date":"2026-07-16","winners":["Len","Antz"],"losers":["Harry","PDM"],"sets":[[6,2],[6,3],[7,5]],"type":"doubles","note":"","id":"base_26","verified":true},{"date":"2026-07-17","winners":["Harry","Len"],"losers":["Max","Eli"],"sets":[[6,2],[6,2]],"type":"doubles","note":"","id":"base_27","verified":true},{"date":"2026-07-17","winners":["Len","Erf"],"losers":["Kaz","Rishi"],"sets":[[6,4],[6,3]],"type":"doubles","note":"","id":"base_28","verified":true},{"date":"2026-07-17","winners":["Kaz","Jords"],"losers":["Rishi","Erf"],"sets":[[2,6],[6,2],[6,1]],"type":"doubles","note":"","id":"base_29","verified":true},{"date":"2026-07-18","winners":["Rishi","Eli"],"losers":["Max","PDM"],"sets":[[5,7],[6,1],[6,3]],"type":"doubles","note":"","id":"base_30","verified":true},{"date":"2026-07-20","winners":["Harry","PDM"],"losers":["Rishi","Chloe"],"sets":[[6,2],[4,6],[6,2]],"type":"doubles","note":"opponent listed as 'CC'","id":"base_31","verified":true},{"date":"2026-07-20","winners":["Harry","Rishi"],"losers":["Jords","Omar"],"sets":[[6,4],[8,7]],"type":"doubles","note":"","id":"base_32","verified":true},{"date":"2026-07-21","winners":["Dennis","Rishi"],"losers":["Harry","PDM"],"sets":[[6,2],[4,6],[6,4]],"type":"doubles","note":"","id":"base_33","verified":true},{"date":"2026-07-21","winners":["KC","Rishi"],"losers":["Antz","Len"],"sets":[[6,3],[7,5]],"type":"doubles","note":"","id":"base_34","verified":true},{"date":"2026-07-22","winners":["Harry","Rocky"],"losers":["Shaun","Max"],"sets":[[6,4],[6,2]],"type":"doubles","note":"","id":"base_35","verified":true},{"date":"2026-07-22","winners":["Harry","Fatch"],"losers":["Shaun","Tee"],"sets":[[6,3],[6,4]],"type":"doubles","note":"","id":"base_36","verified":true},{"date":"2026-07-25","winners":["Tee","Fatch"],"losers":["Rhys","Fee"],"sets":[[4,6],[6,4],[6,2]],"type":"doubles","note":"","id":"base_37","verified":true},{"date":"2026-07-25","winners":["KC","Shaun"],"losers":["Max","PDM"],"sets":[[6,3],[6,3]],"type":"doubles","note":"","id":"base_38","verified":true},{"date":"2026-07-25","winners":["KC","Max"],"losers":["Shaun","PDM"],"sets":[[6,2],[7,6]],"type":"doubles","note":"","id":"base_39","verified":true},{"date":"2026-07-27","winners":["Tom","Shaun"],"losers":["Max","Tee"],"sets":[[6,1],[6,4]],"type":"doubles","note":"","id":"base_40","verified":true},{"date":"2026-07-30","winners":["PDM","Rishi"],"losers":["Harry","Rocky"],"sets":[[6,0],[6,0]],"type":"doubles","note":"","id":"base_41","verified":true},{"date":"2026-07-30","winners":["KC","Fatch"],"losers":["Max","Rishi"],"sets":[[6,4],[6,3],[7,5]],"type":"doubles","note":"","id":"base_42","verified":true},{"date":"2026-07-30","winners":["Fatch","Antz"],"losers":["Rishi","Jords"],"sets":[[6,2],[1,6],[6,3]],"type":"doubles","note":"","id":"base_43","verified":true},{"date":"2026-08-01","winners":["PDM","Rishi"],"losers":["Jords","Omar"],"sets":[[6,3],[6,2],[6,3]],"type":"doubles","note":"","id":"base_44","verified":true},{"date":"2026-08-02","winners":["Jams","Rishi"],"losers":["Fatch","Tom"],"sets":[[6,4],[3,6],[7,6]],"type":"doubles","note":"","id":"base_45","verified":true},{"date":"2026-08-02","winners":["Tee","MK"],"losers":["Tom","Shaun"],"sets":[[5,7],[6,4],[6,3]],"type":"doubles","note":"","id":"base_46","verified":true},{"date":"2026-08-03","winners":["KC","Max"],"losers":["Erf","Rishi"],"sets":[[5,7],[6,1],[7,6]],"type":"doubles","note":"","id":"base_47","verified":true},{"date":"2026-08-04","winners":["Aubyn","Antz"],"losers":["Fatch","Jams"],"sets":[[6,4],[6,3]],"type":"doubles","note":"","id":"base_48","verified":true},{"date":"2026-08-04","winners":["MK","Fatch"],"losers":["Shaun","Tom"],"sets":[[6,4],[6,3]],"type":"doubles","note":"","id":"base_49","verified":true},{"date":"2026-08-05","winners":["Rishi","Jams"],"losers":["Aubyn","Antz"],"sets":[[6,2],[6,2],[2,6]],"type":"doubles","note":"","id":"base_50","verified":true},{"date":"2026-08-05","winners":["Rishi","Omar"],"losers":["Max","Eli"],"sets":[[7,6],[4,6],[6,3]],"type":"doubles","note":"","id":"base_51","verified":true},{"date":"2026-08-06","winners":["Skapz","Rhys"],"losers":["Tee","Fee"],"sets":[[6,2],[6,2],[3,6]],"type":"doubles","note":"","id":"base_52","verified":true},{"date":"2026-08-08","winners":["Tom","Erf"],"losers":["Antz","Fatch"],"sets":[[6,3],[6,2],[6,4]],"type":"doubles","note":"","id":"base_53","verified":true},{"date":"2026-08-08","winners":["Erf","PDM"],"losers":["Osh","Fatch"],"sets":[[8,6],[6,2]],"type":"doubles","note":"","id":"base_54","verified":true},{"date":"2026-08-09","winners":["Len","Fatch"],"losers":["PDM","Antz"],"sets":[[8,6],[5,7],[9,7]],"type":"doubles","note":"","id":"base_55","verified":true},{"date":"2026-08-09","winners":["Rocky","Max"],"losers":["MK","Fatch"],"sets":[[6,4],[6,4],[7,6]],"type":"doubles","note":"","id":"base_56","verified":true},{"date":"2026-08-11","winners":["Osh","Eli"],"losers":["PDM","Max"],"sets":[[6,3],[6,4]],"type":"doubles","note":"","id":"base_57","verified":true},{"date":"2026-08-11","winners":["PDM","Shaun"],"losers":["Tarique","Max"],"sets":[[6,3],[6,2]],"type":"doubles","note":"","id":"base_58","verified":true},{"date":"2026-08-12","winners":["Rocky","PDM"],"losers":["Rishi","Max"],"sets":[[6,2],[6,4],[6,7]],"type":"doubles","note":"","id":"base_59","verified":true},{"date":"2026-08-14","winners":["Mulley","Osh"],"losers":["KC","Shaun"],"sets":[[4,6],[7,5],[6,2]],"type":"doubles","note":"","id":"base_60","verified":true},{"date":"2026-08-14","winners":["Max","Kaz"],"losers":["PDM","Rishi"],"sets":[[5,7],[6,0],[6,3]],"type":"doubles","note":"","id":"base_61","verified":true},{"date":"2026-08-15","winners":["KC","Fatch"],"losers":["Max","PDM"],"sets":[[4,6],[7,5],[6,2]],"type":"doubles","note":"","id":"base_62","verified":true},{"date":"2026-08-15","winners":["Max","Fatch"],"losers":["Rocky","PDM"],"sets":[[6,4],[6,3]],"type":"doubles","note":"","id":"base_63","verified":true},{"date":"2026-08-16","winners":["Len","Eli"],"losers":["Rishi","PDM"],"sets":[[6,1],[6,4]],"type":"doubles","note":"","id":"base_64","verified":true},{"date":"2026-08-16","winners":["Osh","KC"],"losers":["Max","Kaz"],"sets":[[6,1],[6,2],[6,1]],"type":"doubles","note":"","id":"base_65","verified":true},{"date":"2026-08-17","winners":["Osh","Eli"],"losers":["Len","KC"],"sets":[[6,4],[6,3]],"type":"doubles","note":"score corrected from 6-4 6-4","id":"base_66","verified":true},{"date":"2026-08-19","winners":["Rishi","Omar"],"losers":["PDM","Shaun"],"sets":[[7,5],[6,3],[6,4]],"type":"doubles","note":"double or quits","id":"base_67","verified":true},{"date":"2026-08-19","winners":["Max","Aubyn"],"losers":["Rishi","Jams"],"sets":[[6,4],[6,0],[8,6]],"type":"doubles","note":"","id":"base_68","verified":true},{"date":"2026-08-20","winners":["Rishi","Len"],"losers":["Eli","Stormzy"],"sets":[[6,3],[6,1],[6,4]],"type":"doubles","note":"double or quits","id":"base_69","verified":true},{"date":"2026-08-20","winners":["Rishi","Stormzy"],"losers":["Fatch","Max"],"sets":[[6,3],[3,6],[6,3]],"type":"doubles","note":"","id":"base_70","verified":true},{"date":"2026-08-21","winners":["Max"],"losers":["Fatch"],"sets":[[15,11],[15,9]],"type":"singles","note":"","id":"base_71","verified":true},{"date":"2026-08-21","winners":["Rishi","PDM"],"losers":["Stormzy","Max"],"sets":[[7,5],[6,2]],"type":"doubles","note":"","id":"base_72","verified":true},{"date":"2026-08-21","winners":["Stormzy","Max"],"losers":["Rishi","PDM"],"sets":[[6,3],[2,6],[6,2]],"type":"doubles","note":"rematch same day","id":"base_73","verified":true},{"date":"2026-08-25","winners":["Tom","Rishi"],"losers":["Max","Rocky"],"sets":[[2,6],[6,3],[6,2]],"type":"doubles","note":"","id":"base_74","verified":true},{"date":"2026-08-25","winners":["Erf","Kaz"],"losers":["Osh","KC"],"sets":[[6,1],[6,2]],"type":"doubles","note":"","id":"base_75","verified":true},{"date":"2026-08-25","winners":["Erf","Kaz"],"losers":["Osh","Eli"],"sets":[[6,1],[6,2]],"type":"doubles","note":"","id":"base_76","verified":true},{"date":"2026-08-27","winners":["Eli","Ant Slice"],"losers":["Rishi","Max"],"sets":[[8,6],[6,2]],"type":"doubles","note":"","id":"base_77","verified":true},{"date":"2026-08-27","winners":["Max","PDM"],"losers":["Ant Slice","Chloe"],"sets":[[4,6],[6,2],[6,2]],"type":"doubles","note":"","id":"base_78","verified":true},{"date":"2026-06-02","winners":["Rishi","Jords"],"losers":["Tarique","Harry"],"sets":[[4,6],[6,3],[7,5]],"type":"doubles","note":"","id":"base_79","verified":true},{"date":"2026-06-02","winners":["Rocky","Harry"],"losers":["Rishi","Jords"],"sets":[[6,4],[6,4],[3,6]],"type":"doubles","note":"","id":"base_80","verified":true},{"date":"2026-06-03","winners":["Harry","Antz"],"losers":["Rishi","MK"],"sets":[[1,6],[6,1],[8,6]],"type":"doubles","note":"","id":"base_81","verified":true},{"date":"2026-06-04","winners":["Harry","Tom"],"losers":["Fatch","Jords"],"sets":[[7,5],[6,2]],"type":"doubles","note":"","id":"base_82","verified":true},{"date":"2026-06-04","winners":["Fatch","Harry"],"losers":["Tom","Jords"],"sets":[[2,6],[6,1],[7,5]],"type":"doubles","note":"","id":"base_83","verified":true},{"date":"2026-06-05","winners":["Rocky","Tarique"],"losers":["Rishi","Harry"],"sets":[[6,3],[6,4],[2,6]],"type":"doubles","note":"","id":"base_84","verified":true},{"date":"2026-06-07","winners":["Max","Tom"],"losers":["Shaun","MK"],"sets":[[6,2],[6,3],[4,6]],"type":"doubles","note":"","id":"base_85","verified":true},{"date":"2026-06-07","winners":["Stormzy","Len"],"losers":["Rishi","Antz"],"sets":[[6,3],[6,0]],"type":"doubles","note":"","id":"base_86","verified":true},{"date":"2026-06-07","winners":["Rishi","Antz"],"losers":["Stormzy","Len"],"sets":[[7,6],[4,6],[6,3]],"type":"doubles","note":"rematch same session","id":"base_87","verified":true},{"date":"2026-06-09","winners":["Rishi","Fatch"],"losers":["Chloe","Jords"],"sets":[[2,6],[6,2],[6,2]],"type":"doubles","note":"","id":"base_88","verified":true},{"date":"2026-06-09","winners":["Rishi","Chloe"],"losers":["Fatch","Jords"],"sets":[[6,0],[6,1]],"type":"doubles","note":"rematch same session","id":"base_89","verified":true},{"date":"2026-06-09","winners":["Erf","Osh"],"losers":["Eli","Len"],"sets":[[4,6],[7,5],[6,3]],"type":"doubles","note":"","id":"base_90","verified":true},{"date":"2026-06-10","winners":["Eli","Harry"],"losers":["Jords","KC"],"sets":[[4,6],[6,0],[6,2]],"type":"doubles","note":"","id":"base_91","verified":true},{"date":"2026-06-14","winners":["Jords","MK"],"losers":["Rocky","Fatch"],"sets":[[9,7],[6,1]],"type":"doubles","note":"","id":"base_92","verified":true},{"date":"2026-06-14","winners":["Max","Shaun"],"losers":["MK","Harry"],"sets":[[6,4],[7,5],[5,7]],"type":"doubles","note":"","id":"base_93","verified":true},{"date":"2026-06-16","winners":["Max","Rishi"],"losers":["KC","Tom"],"sets":[[6,3],[6,3],[8,6]],"type":"doubles","note":"","id":"base_94","verified":true},{"date":"2026-06-16","winners":["Jords","Kaz"],"losers":["Rishi","Eli"],"sets":[[6,4],[6,3],[6,2],[2,6]],"type":"doubles","note":"4 sets as posted","id":"base_95","verified":true},{"date":"2026-06-18","winners":["Shaun","Rocky"],"losers":["Harry","Jords"],"sets":[[6,1],[6,4],[6,2]],"type":"doubles","note":"","id":"base_96","verified":true},{"date":"2026-06-21","winners":["Max","Rishi"],"losers":["Tarique","Kaz"],"sets":[[7,5],[3,6],[7,5]],"type":"doubles","note":"","id":"base_97","verified":true},{"date":"2026-06-21","winners":["Rishi","Fatch"],"losers":["Antz","Tarique"],"sets":[[7,5],[6,8],[6,3]],"type":"doubles","note":"","id":"base_98","verified":true},{"date":"2026-06-22","winners":["Max","Kaz"],"losers":["KC","Rishi"],"sets":[[6,4],[6,4],[4,6]],"type":"doubles","note":"","id":"base_99","verified":true},{"date":"2026-06-22","winners":["Rishi","Del"],"losers":["Harry","Dennis"],"sets":[[6,2],[6,4]],"type":"doubles","note":"'wolf emoji'=Rishi; Del one-off, Tier A","id":"base_100","verified":true},{"date":"2026-06-23","winners":["Erf","Shaun"],"losers":["Rishi","Max"],"sets":[[6,2],[6,3]],"type":"doubles","note":"","id":"base_101","verified":true},{"date":"2026-06-24","winners":["Erf","Eli"],"losers":["KC","Shaun"],"sets":[[6,4],[6,4]],"type":"doubles","note":"game 1","id":"base_102","verified":true},{"date":"2026-06-24","winners":["KC","Shaun"],"losers":["Erf","Eli"],"sets":[[6,3],[6,3]],"type":"doubles","note":"game 2 rematch","id":"base_103","verified":true},{"date":"2026-06-26","winners":["Fatch","Antz"],"losers":["Jords","M.R"],"sets":[[6,2],[6,2]],"type":"doubles","note":"M.R identity unconfirmed, Tier C","id":"base_104","verified":true},{"date":"2026-06-28","winners":["Len"],"losers":["Harry"],"sets":[[6,7],[6,2],[6,4]],"type":"singles","note":"","id":"base_105","verified":true},{"date":"2026-06-29","winners":["Kaz","Osh"],"losers":["KC","Erf"],"sets":[[6,4],[6,3]],"type":"doubles","note":"","id":"base_106","verified":true},{"date":"2026-06-30","winners":["KC","Rishi"],"losers":["Osh","Harry"],"sets":[[6,2],[6,3]],"type":"doubles","note":"","id":"base_107","verified":true},{"date":"2026-06-30","winners":["KC","Rishi"],"losers":["Harry","Osh"],"sets":[[6,3],[6,4]],"type":"doubles","note":"2nd match same session","id":"base_108","verified":true},{"date":"2026-06-30","winners":["Harry","Osh"],"losers":["KC","Rishi"],"sets":[[6,2],[6,3]],"type":"doubles","note":"double or quits decider","id":"base_109","verified":true},{"date":"2026-06-30","winners":["Max","MK"],"losers":["Tarique","Rocky"],"sets":[[6,4],[6,0]],"type":"doubles","note":"","id":"base_110","verified":true},{"date":"2026-06-30","winners":["Harry","Len"],"losers":["Max","Erf"],"sets":[[6,3],[3,6],[6,4]],"type":"doubles","note":"","id":"base_111","verified":true},{"date":"2026-07-11","winners":["Omar","Jords"],"losers":["Tom","Max"],"sets":[[7,6],[4,6],[6,2]],"type":"doubles","note":"final corrected version","id":"base_112","verified":true},{"date":"2026-07-18","winners":["Tom","Chloe"],"losers":["Fatch","Antz"],"sets":[[6,2],[7,5],[7,5],[6,3]],"type":"doubles","note":"4 sets as posted","id":"base_113","verified":true},{"date":"2026-07-19","winners":["Kaz","Tom"],"losers":["Rocky","MK"],"sets":[[6,1],[6,1]],"type":"doubles","note":"","id":"base_114","verified":true},{"date":"2026-08-19","winners":["Eli","Stormzy"],"losers":["Osh","Jords"],"sets":[[6,8],[6,3],[6,3]],"type":"doubles","note":"","id":"base_115","verified":true},{"date":"2026-08-19","winners":["Eli","Stormzy"],"losers":["Osh","Jords"],"sets":[[7,5],[6,1]],"type":"doubles","note":"part 2, same session","id":"base_116","verified":true},{"date":"2026-08-23","winners":["Stormzy","Chloe"],"losers":["Jords","Tom"],"sets":[[6,1],[5,7],[6,2],[5,7],[6,1]],"type":"doubles","note":"5 sets, final corrected version","id":"base_117","verified":true},{"date":"2026-08-26","winners":["PDM","Max"],"losers":["Chloe","Antz"],"sets":[[4,6],[6,2],[6,1]],"type":"doubles","note":"double or quits 2-1, to be continued","id":"base_118","verified":true},{"date":"2026-08-29","winners":["PDM","Tom"],"losers":["Fatch","Shaun"],"sets":[[6,3],[6,3],[6,4]],"type":"doubles","note":"","id":"base_119","verified":true},{"date":"2026-07-20","winners":["Kaz","Tom"],"losers":["Rocky","MK"],"sets":[[6,0],[6,4]],"type":"doubles","note":"from spreadsheet MAT0091","id":"zgnew_0","verified":true},{"date":"2026-07-21","winners":["Tom","Shaun"],"losers":["Max","Tee"],"sets":[[6,1],[6,4]],"type":"doubles","note":"from spreadsheet MAT0092","id":"zgnew_1","verified":true},{"date":"2026-08-01","winners":["Jams","Rishi"],"losers":["Fatch","Tom"],"sets":[[4,6],[6,3],[7,6]],"type":"doubles","note":"from spreadsheet MAT0098","id":"zgnew_2","verified":true},{"date":"2026-08-02","winners":["Tee","MK"],"losers":["Tom","Shaun"],"sets":[[5,7],[6,4],[6,3]],"type":"doubles","note":"from spreadsheet MAT0099","id":"zgnew_3","verified":true},{"date":"2026-08-04","winners":["MK","Fatch"],"losers":["Shaun","Tom"],"sets":[[6,4],[6,3]],"type":"doubles","note":"from spreadsheet MAT0102","id":"zgnew_4","verified":true},{"date":"2026-08-10","winners":["Tom","Erf"],"losers":["Antz","Fatch"],"sets":[[6,3],[6,2]],"type":"doubles","note":"from spreadsheet MAT0115","id":"zgnew_5","verified":true},{"date":"2026-08-25","winners":["Tom","Rishi"],"losers":["Max","Rocky"],"sets":[[2,6],[6,3],[6,3]],"type":"doubles","note":"from spreadsheet MAT0130","id":"zgnew_6","verified":true}];
const BASE_TIERS = {"Manny": "S", "Erf": "A", "Kaz": "A", "Twoshay": "A", "Osh": "A", "Eli": "A", "Dennis": "A", "Ant Slice": "A", "Len": "A", "Rishi": "B", "Omar": "B", "Chloe": "B", "Max": "B", "James": "B", "MK": "B", "Antz": "B", "Rocky": "B", "Harry": "B", "PDM": "B", "Shaun": "B", "Jords": "B", "Tarique": "B", "Tom": "B", "Fatch": "B", "Jams": "C", "Aubyn": "C", "Rhys": "C", "Tee": "C", "Skapz": "C", "Stormzy": "B", "KC": "A", "Mulley": "B", "Fee": "C", "Carla": "B", "Del": "A", "M.R": "C", "Kam": "B", "bruh": "B", "Kevin": "B", "Abby": "B", "Alfie": "B"};
const BASE_ACTIVE = {"Manny": true, "Erf": true, "Kaz": true, "Twoshay": false, "Osh": true, "Eli": true, "Dennis": true, "Ant Slice": true, "Len": true, "Rishi": true, "Omar": true, "Chloe": true, "Max": true, "James": true, "MK": true, "Antz": true, "Rocky": true, "Harry": true, "PDM": true, "Shaun": true, "Jords": true, "Tarique": true, "Tom": true, "Fatch": true, "Jams": true, "Aubyn": true, "Rhys": true, "Tee": true, "Skapz": true, "Stormzy": true, "KC": true, "Mulley": true, "Fee": true, "Carla": true, "Del": false, "M.R": true, "Kam": false, "bruh": false, "Kevin": false, "Abby": false, "Alfie": false};
// Tier a player started at, if different from their current tier (e.g. a promotion/demotion).
// Used only to seed their rating correctly at their first-ever match -- their current tier
// (BASE_TIERS, above) is still what's used everywhere else: Find a Game, tier boundaries, badges.
const BASE_STARTING_TIER = {"Fatch": "C"};

// ===================== NORTH VS SOUTH (Box Office Cup) =====================
// A one-off exhibition team event between two padel groups -- entirely
// separate from the Money Padel rating system. Nothing here reads or writes
// PLAYERS/MATCHES/ratings/tiers; it's surfaced in the More section as its
// own self-contained page. Fixtures are hardcoded like BASE_MATCHES once
// the list is confirmed (they're fixed for the event, not something that
// needs live editing); only match results are Firestore-backed, added live
// on the night -- same "base data + live overlay" split used everywhere
// else in this app.
const NORTH_SOUTH_EVENT = {
  name: 'Box Office Cup',
  subtitle: 'North vs South',
  date: 'Thursday 10 September',
  time: '7:30pm – 11:00pm',
  venue: 'Encore Padel',
  address: 'Unit GH, Ventura Park, Radlett, St Albans, AL2 2DB',
  notes: [
    'Team event — a different partner from your own team each match.',
    'Each player plays 3 matches.',
    'Fast4: first to 4 games, tiebreak at 3-3 (to 7). If the match reaches one set each, a match tiebreak to 10 decides it.',
    'Star Point: golden point after the second deuce.',
    '3 points for a win. 1 point for a loss where you still won a set, or for a draw (unfinished on time). 0 points for a straight-sets loss.',
    'Trophy for the winning team, plus Best & Worst Player of the day.',
  ],
};

// The confirmed "Our Team" roster. Which side this actually is (North or
// South) is just a label choice -- kept as NORTH here since that's the team
// named in the reminder message.
const NORTH_ROSTER = ['KC', 'Kaz', 'Erf', 'Tom', 'Osh', 'Rishi', 'Max', 'Len'];
const SOUTH_ROSTER = []; // filled in once the fixture list confirms South's players

// Each fixture is one North pair vs one South pair. Populated once the
// fixture list is confirmed -- e.g. { id:'ns1', round:1, north:['KC','Kaz'], south:['?','?'] }.
// Results are never stored here; see northSouthResultsState below.
const NORTH_SOUTH_FIXTURES = [];

// ===================== LIVE STATE =====================
let ALL_MATCHES = [];      // BASE_MATCHES + user-added
let TIER_MAP = {};         // name -> tier (base + overrides + new players)
let ACTIVE_MAP = {};       // name -> bool
let STARTING_TIER_MAP = {};// name -> tier they started at, if different from current (used for seeding only)

let PLAYERS = [];
let MATCHES = [];
let DRAW_MATCHES = [];     // enriched draws; see recomputeAll and matchesIncludingDraws()
let PARTNERSHIPS = [];
let BEST_PARTNER = {};
let BOUNDARY_TESTS = [];
let CALIBRATION_GAMES = [];
let WITHIN_TIER_GAMES = [];
let DIFFICULTY_SUGGESTIONS = {};
let INACTIVE_PLAYERS = new Set();
let H2H = {};

const TIER_SEED = {S:2000, A:1700, B:1400, C:1100};
const TIER_ORDER_LIST = ["S","A","B","C"];
const TIER_IDX = {S:0,A:1,B:2,C:3};

// ===================== STORAGE (Firebase Firestore + localStorage) =====================
// Beta v3 project — deliberately NOT the live `mp---dashboard` project the
// production dashboard reads and writes. v3 must never write to production.
// This database starts empty: the Firestore overlays (approved submissions,
// match edits, deletions, tier overrides) still live in the production project
// and have not been migrated, so anything this app computes from Firestore
// alone will differ from production until that migration runs.
const firebaseConfig = {
  apiKey: "AIzaSyDIiA5NVo3jKCkr_Kzi8y1fJhzXsWNuVmY",
  authDomain: "mp-dashboard-beta-v3.firebaseapp.com",
  projectId: "mp-dashboard-beta-v3",
  storageBucket: "mp-dashboard-beta-v3.firebasestorage.app",
  messagingSenderId: "1084285278543",
  appId: "1:1084285278543:web:c183d0e28374747a234d3a"
};

let db = null;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} catch(e) {
  console.error('Firebase init failed — check firebaseConfig at the top of the script.', e);
}

const FS_COLLECTION = 'moneypadel'; // one Firestore collection, one document per storage key

let lastStorageError = null;

function storageAvailable(){
  return !!db;
}

async function fsGet(key){
  const doc = await db.collection(FS_COLLECTION).doc(key).get();
  return doc.exists ? doc.data().value : null;
}
async function fsSet(key, value){
  await db.collection(FS_COLLECTION).doc(key).set({ value, updatedAt: Date.now() });
}

// Read one stored document and parse it, falling back to `fallback` if it is
// missing or unreadable. Every caller did exactly this; having it once is what
// makes the reads safe to fire concurrently -- a rejected promise inside a
// Promise.all would otherwise take the whole of start-up down with it, where
// the sequential version quietly logged and carried on.
async function fsGetJson(key, fallback, label){
  try {
    const v = await fsGet(key);
    if(v) return JSON.parse(v);
  } catch(e){ console.error('load ' + (label || key) + ' failed', e); }
  return fallback;
}

const STORAGE_KEY_MATCHES = 'moneypadel_extra_matches';   // pending + approved submissions
const STORAGE_KEY_TAGS = 'moneypadel_player_tags';
const STORAGE_KEY_EDITS = 'moneypadel_match_edits';        // id -> override fields
const STORAGE_KEY_DELETED = 'moneypadel_deleted_ids';      // array of ids, soft-delete
const STORAGE_KEY_VISIBILITY = 'moneypadel_visibility';    // shared: which sections non-admins can see
const STORAGE_KEY_MY_NAME = 'moneypadel_my_name';          // personal — localStorage, this device only
const STORAGE_KEY_GAME_REQUESTS = 'moneypadel_game_requests'; // shared: wishlist + upcoming games
const STORAGE_KEY_DEV_AREAS = 'moneypadel_dev_areas'; // shared: freeform per-player development notes
const STORAGE_KEY_CHALLENGES = 'moneypadel_challenges'; // shared: sequential turn-based match challenges (separate from gameRequestsState -- see buildCompleteMatchWithPartner/bridgeChallengeToRequest below for why)
const STORAGE_KEY_NS_RESULTS = 'moneypadel_north_south_results'; // shared: live results for the North vs South exhibition, keyed by fixture id -- see NORTH_SOUTH_FIXTURES above

// Sections an admin can hide from non-admin viewers. Admins always see everything.
const VISIBILITY_DEFAULTS = {
  // Find a Game is a player feature (Shaun, 28 Sep: D4). Its predictions are
  // not -- see canSeePredictions -- so the tab itself defaults to visible.
  findgame: true,       // Find a Game — matchmaking
  difficulty: false,    // Easy/Balanced/Hard suggestions on player profiles
  callouts: true,       // Call-Outs tab
  chemistry: true,      // Partnership chemistry rankings
  power: true,          // Power Rating tab
  games: true,          // Games (chronological log)
  players: true,        // Players A–Z
  wishlist: true,        // Game requests / wishlist
  upcoming: true,        // Confirmed upcoming games
};
const VISIBILITY_LABELS = {
  findgame: 'Find a Game tab (matchmaking)',
  difficulty: 'Easy / Balanced / Hard suggestions on profiles',
  callouts: 'Call-Outs tab',
  chemistry: 'Partnership chemistry rankings',
  power: 'Power Rating tab',
  games: 'Games tab (match log)',
  players: 'Players tab',
  wishlist: 'Wishlist tab (game requests)',
  upcoming: 'Upcoming tab (confirmed games)',
};
let visibilityState = {...VISIBILITY_DEFAULTS};

// Admins see everything; everyone else only sees what's switched on.
function canSee(section){
  if(isUnlocked) return true;
  return visibilityState[section] !== false;
}

// Which setting governs each screen. The one map: the tab guard, the shell's
// sub-navigation, the More sheet and every in-app shortcut read it, so a
// screen switched to Admin only is hidden by every route to it, not just by
// the legacy tab row nobody sees any more (audit D4).
const TAB_VISIBILITY_KEY = {
  power: 'power', callouts: 'callouts', findgame: 'findgame', games: 'games',
  players: 'players', wishlist: 'wishlist', upcoming: 'upcoming',
  // 'wl', 'summary', 'h2h' and 'manage' have no setting (manage is lock-gated).
};
function canSeeTab(tab){
  const key = TAB_VISIBILITY_KEY[tab];
  return !key || canSee(key);
}
// Where to go instead of a hidden screen: the first visible screen in the same
// section of the shell, else Win/Loss, which has no setting.
function visibleFallbackTab(tab){
  const sec = (typeof TAB_TO_SECTION !== 'undefined') ? TAB_TO_SECTION[tab] : null;
  const same = (sec && typeof SECTION_SUBNAV !== 'undefined' && SECTION_SUBNAV[sec])
    ? SECTION_SUBNAV[sec].map(i => i.tab).filter(t => t !== tab && canSeeTab(t)) : [];
  return same[0] || 'wl';
}

// Predictions -- a win percentage, or a favourite / underdog call, for a game
// that has not been played -- are Admin-only, always, wherever they would
// appear (Shaun, 21 Sep; restated 28 Sep, D4). A fixed rule, not a setting:
// players could use them to dodge agreed games or cherry-pick easy ones.
// Recorded matches keep their own expectation, which explains a rating
// already moved and is not a prediction.
function canSeePredictions(){ return !!isUnlocked; }

async function loadVisibility(){
  try { const v = await fsGet(STORAGE_KEY_VISIBILITY); if(v) return {...VISIBILITY_DEFAULTS, ...JSON.parse(v)}; } catch(e){ console.error('load visibility failed', e); }
  return {...VISIBILITY_DEFAULTS};
}
async function saveVisibility(vis){
  try {
    await fsSet(STORAGE_KEY_VISIBILITY, JSON.stringify(vis));
    return true;
  } catch(e){ lastStorageError = (e && e.message) ? e.message : String(e); console.error('save visibility failed', e); return false; }
}

let gameRequestsState = []; // {id, requestedBy, requestedAt, players:[4 names], confirmations:{name:bool}, status:'pending'|'confirmed'|'removed'}

async function loadGameRequests(){
  try { const v = await fsGet(STORAGE_KEY_GAME_REQUESTS); if(v) return JSON.parse(v); } catch(e){ console.error('load game requests failed', e); }
  return [];
}
async function saveGameRequests(requests){
  try {
    await fsSet(STORAGE_KEY_GAME_REQUESTS, JSON.stringify(requests));
    return true;
  } catch(e){ lastStorageError = (e && e.message) ? e.message : String(e); console.error('save game requests failed', e); return false; }
}

let devAreasState = []; // [{id, player, text, addedBy, addedAt}]

async function loadDevAreas(){
  try { const v = await fsGet(STORAGE_KEY_DEV_AREAS); if(v) return JSON.parse(v); } catch(e){ console.error('load dev areas failed', e); }
  return [];
}
async function saveDevAreas(areas){
  try {
    await fsSet(STORAGE_KEY_DEV_AREAS, JSON.stringify(areas));
    return true;
  } catch(e){ lastStorageError = (e && e.message) ? e.message : String(e); console.error('save dev areas failed', e); return false; }
}

// {id, createdAt, createdBy, challenger, challenged, firstPicker:'challenger'|'challenged',
//  firstRestriction:'any'|'S'|'A'|'B'|'C', secondRestriction: same,
//  firstPartner:null|name, secondPartner:null|name,
//  state:'waiting_first_pick'|'waiting_second_pick'|'ready'|'confirmed'|'declined'|'cancelled',
//  linkedRequestId:null|id, respondedAt:null|iso}
// Deliberately its own store rather than folded into gameRequestsState -- see the
// "Complete-match recommendations" / Challenge section below for the schema reasoning.
// No rating/balance numbers are ever stored here -- the match % is always recomputed
// live from current PLAYERS data, same as everywhere else in the app.
let challengesState = [];

async function loadChallenges(){
  try { const v = await fsGet(STORAGE_KEY_CHALLENGES); if(v) return JSON.parse(v); } catch(e){ console.error('load challenges failed', e); }
  return [];
}
async function saveChallenges(challenges){
  try {
    await fsSet(STORAGE_KEY_CHALLENGES, JSON.stringify(challenges));
    return true;
  } catch(e){ lastStorageError = (e && e.message) ? e.message : String(e); console.error('save challenges failed', e); return false; }
}

// fixture id -> {sets:[[northGames,southGames],...], matchTiebreak:[n,s]|null, status:'completed'|'draw'}
let northSouthResultsState = {};

async function loadNorthSouthResults(){
  try { const v = await fsGet(STORAGE_KEY_NS_RESULTS); if(v) return JSON.parse(v); } catch(e){ console.error('load north vs south results failed', e); }
  return {};
}
async function saveNorthSouthResults(results){
  try {
    await fsSet(STORAGE_KEY_NS_RESULTS, JSON.stringify(results));
    return true;
  } catch(e){ lastStorageError = (e && e.message) ? e.message : String(e); console.error('save north vs south results failed', e); return false; }
}

function getNorthSouthFixtureResult(fx){
  return northSouthResultsState[fx.id] || null;
}

// Winner always gets 3. The losing side gets 1 only if they actually won a
// set -- only possible when the match went one set each and was decided by
// the match tiebreak. A draw (ran out of time, unfinished) is 1 point each.
function scoreNorthSouthFixture(fx){
  const res = getNorthSouthFixtureResult(fx);
  if(!res) return null;
  if(res.status === 'draw') return { northPts:1, southPts:1, northSets:0, southSets:0, winner:null };
  let northSets = 0, southSets = 0;
  (res.sets || []).forEach(([n,s])=>{ if(n>s) northSets++; else if(s>n) southSets++; });
  let winner = null;
  if(northSets>=2 || southSets>=2){
    winner = northSets>southSets ? 'north' : 'south';
  } else if(northSets===1 && southSets===1 && res.matchTiebreak){
    winner = res.matchTiebreak[0]>res.matchTiebreak[1] ? 'north' : 'south';
  }
  if(!winner) return null; // incomplete data (e.g. only one set logged so far) -- not decided yet
  const northPts = winner==='north' ? 3 : (northSets>=1 ? 1 : 0);
  const southPts = winner==='south' ? 3 : (southSets>=1 ? 1 : 0);
  return { northPts, southPts, northSets, southSets, winner };
}

function computeNorthSouthTable(){
  const blank = ()=>({ played:0, won:0, drawn:0, lost:0, setsFor:0, setsAgainst:0, points:0 });
  const table = { north: blank(), south: blank() };
  NORTH_SOUTH_FIXTURES.forEach(fx=>{
    const r = scoreNorthSouthFixture(fx);
    if(!r) return;
    table.north.played++; table.south.played++;
    table.north.setsFor += r.northSets; table.north.setsAgainst += r.southSets;
    table.south.setsFor += r.southSets; table.south.setsAgainst += r.northSets;
    table.north.points += r.northPts; table.south.points += r.southPts;
    if(r.winner==='north'){ table.north.won++; table.south.lost++; }
    else if(r.winner==='south'){ table.south.won++; table.north.lost++; }
    else { table.north.drawn++; table.south.drawn++; }
  });
  return table;
}

// Four independent documents. Read together rather than one after another:
// none of them is an input to any of the others, so reading them in sequence
// only ever bought four round trips where one would do. See init() for the
// same argument applied to the whole of start-up.
async function loadStoredData(){
  const [extraMatches, tagOverrides, matchEdits, deletedIds] = await Promise.all([
    fsGetJson(STORAGE_KEY_MATCHES, [], 'matches'),
    fsGetJson(STORAGE_KEY_TAGS, {}, 'tags'),
    fsGetJson(STORAGE_KEY_EDITS, {}, 'edits'),
    fsGetJson(STORAGE_KEY_DELETED, [], 'deleted ids'),
  ]);
  return {extraMatches, tagOverrides, matchEdits, deletedIds};
}

async function loadMyName(){
  try { const v = localStorage.getItem(STORAGE_KEY_MY_NAME); if(v) return JSON.parse(v); } catch(e){ /* not set yet */ }
  return '';
}
async function saveMyName(name){
  try { localStorage.setItem(STORAGE_KEY_MY_NAME, JSON.stringify(name)); } catch(e){ /* best effort */ }
}

// ===================== ADMIN LOCK (deterrent, not real security) =====================
const STORAGE_KEY_ADMIN_PW_OWNER = 'moneypadel_admin_pw_owner_hash'; // shared, in Firestore
const STORAGE_KEY_ADMIN_PW_BOARD = 'moneypadel_admin_pw_board_hash'; // shared, in Firestore
const STORAGE_KEY_MY_UNLOCKED = 'moneypadel_my_unlocked';  // personal — localStorage, this device only

let ownerPasswordHash = null;
let boardPasswordHash = null;
// WHICH admin, not just whether. The board has a password of its own, so
// "unlocked" has never meant "this is Shaun". Anything that should reach the
// owner and not the board needs this, and until now nothing recorded it.
let adminRole = null;   // 'owner' | 'board' | null
let isUnlocked = false;

function simpleHash(str){
  let hash = 0;
  for(let i=0;i<str.length;i++){
    hash = ((hash<<5)-hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return (hash>>>0).toString(16);
}

async function loadPasswordHash(key){
  try { const v = await fsGet(key); if(v) return JSON.parse(v); } catch(e){ console.error('load password failed', key, e); }
  return null;
}
async function savePasswordHash(key, hash){
  try {
    await fsSet(key, JSON.stringify(hash));
    return true;
  } catch(e){
    lastStorageError = (e && e.message) ? e.message : String(e);
    console.error('savePasswordHash failed:', key, e);
    return false;
  }
}
async function loadMyUnlocked(){
  try {
    const v = localStorage.getItem(STORAGE_KEY_MY_UNLOCKED);
    if(v){
      const parsed = JSON.parse(v);
      // Older devices stored a bare boolean. An unlock with no recorded role is
      // treated as 'board': the lesser of the two, so a stale value can never
      // hand someone the owner's view.
      if(parsed === true){ adminRole = 'board'; return true; }
      if(parsed && parsed.unlocked){ adminRole = parsed.role === 'owner' ? 'owner' : 'board'; return true; }
    }
  } catch(e){ /* not set yet */ }
  adminRole = null;
  return false;
}
async function saveMyUnlocked(val, role){
  try {
    localStorage.setItem(STORAGE_KEY_MY_UNLOCKED,
      JSON.stringify(val ? { unlocked: true, role: role || adminRole || 'board' } : { unlocked: false }));
  } catch(e){ /* best effort */ }
}
function isOwnerAdmin(){ return isUnlocked && adminRole === 'owner'; }

function buildLockScreenHtml(){
  const settingNew = !ownerPasswordHash && !boardPasswordHash;
  const storageWarning = !storageAvailable()
    ? `<div class="section-sub" style="color:#e8a5a1; margin-bottom:8px;">⚠️ This page can't reach shared storage right now. That usually means you're viewing a downloaded copy of this file, or an embed, rather than the actual published/shared link on claude.ai — open that link directly and this should work.</div>`
    : '';
  if(settingNew){
    return `<div class="fg-controls">
      <div class="section-heading" style="margin-top:0;">🔒 Set an admin password</div>
      ${storageWarning}
      <div class="section-sub">No password has been set yet. Whatever you set here will be needed by anyone adding, approving, editing, or deleting games — share it with whoever should have access. You can add a second, independent password later (e.g. for the board to manage themselves) once this one is set. This is a deterrent, not real security: the result is the ledger anyway, this just avoids accidental or casual changes.</div>
      <div class="fg-row"><label class="fg-label">New password</label><input id="lockPw1" type="password" class="fg-select" /></div>
      <div class="fg-row"><label class="fg-label">Confirm password</label><input id="lockPw2" type="password" class="fg-select" /></div>
      <div class="fg-row"><button class="tab-btn active" id="lockSetBtn" style="width:100%;">Set password &amp; unlock</button></div>
      <div id="lockMessage" class="section-sub"></div>
    </div>`;
  }
  return `<div class="fg-controls">
    <div class="section-heading" style="margin-top:0;">🔒 Admin area</div>
    ${storageWarning}
    <div class="section-sub">Enter either admin password to add, approve, edit, or delete games.</div>
    <div class="fg-row"><label class="fg-label">Password</label><input id="lockPwInput" type="password" class="fg-select" /></div>
    <div class="fg-row"><button class="tab-btn active" id="lockUnlockBtn" style="width:100%;">Unlock</button></div>
    <div id="lockMessage" class="section-sub"></div>
  </div>`;
}

function wireLockScreen(onUnlocked){
  const settingNew = !ownerPasswordHash && !boardPasswordHash;
  if(settingNew){
    document.getElementById('lockSetBtn').onclick = async ()=>{
      const p1 = document.getElementById('lockPw1').value;
      const p2 = document.getElementById('lockPw2').value;
      const msg = document.getElementById('lockMessage');
      if(!p1 || p1.length<4){ msg.textContent='Use at least 4 characters.'; return; }
      if(p1!==p2){ msg.textContent="Passwords don't match."; return; }
      const hash = simpleHash(p1);
      const ok = await savePasswordHash(STORAGE_KEY_ADMIN_PW_OWNER, hash);
      if(!ok){
        msg.textContent = storageAvailable()
          ? `Save failed (${lastStorageError || 'unknown error'}) — try again in a moment.`
          : `Save failed — this page can't reach shared storage. Make sure you're on the actual published/shared claude.ai link, not a downloaded file.`;
        return;
      }
      ownerPasswordHash = hash;
      isUnlocked = true;
      adminRole = 'owner';
      await saveMyUnlocked(true, 'owner');
      applyTabVisibility();
      onUnlocked();
    };
  } else {
    document.getElementById('lockUnlockBtn').onclick = async ()=>{
      const p = document.getElementById('lockPwInput').value;
      const msg = document.getElementById('lockMessage');
      const h = simpleHash(p);
      if(h === ownerPasswordHash || h === boardPasswordHash){
        isUnlocked = true;
        // The owner's password wins if both happen to be the same, which is the
        // safe way round: it grants more, and only to someone who knows it.
        adminRole = (h === ownerPasswordHash) ? 'owner' : 'board';
        await saveMyUnlocked(true, adminRole);
        applyTabVisibility();
        onUnlocked();
      } else {
        msg.textContent = 'Incorrect password.';
      }
    };
  }
}

async function saveExtraMatches(extraMatches){
  try {
    await fsSet(STORAGE_KEY_MATCHES, JSON.stringify(extraMatches));
    return true;
  } catch(e){ lastStorageError = (e && e.message) ? e.message : String(e); console.error('save matches failed', e); return false; }
}
async function saveTagOverrides(tagOverrides){
  try {
    await fsSet(STORAGE_KEY_TAGS, JSON.stringify(tagOverrides));
    return true;
  } catch(e){ lastStorageError = (e && e.message) ? e.message : String(e); console.error('save tags failed', e); return false; }
}
async function saveMatchEdits(matchEdits){
  try {
    await fsSet(STORAGE_KEY_EDITS, JSON.stringify(matchEdits));
    return true;
  } catch(e){ lastStorageError = (e && e.message) ? e.message : String(e); console.error('save edits failed', e); return false; }
}
async function saveDeletedIds(deletedIds){
  try {
    await fsSet(STORAGE_KEY_DELETED, JSON.stringify(deletedIds));
    return true;
  } catch(e){ lastStorageError = (e && e.message) ? e.message : String(e); console.error('save deleted ids failed', e); return false; }
}

let extraMatchesState = [];   // each: {id, date, winners, losers, sets, type, note, status, submittedBy, submittedAt}
let tagOverridesState = {};
let matchEditsState = {};     // id -> {date?,winners?,losers?,sets?,type?,note?, editedBy, editedAt}
let deletedIdsState = [];
let currentUserName = '';

function rebuildMapsFromState(){
  TIER_MAP = {...BASE_TIERS};
  ACTIVE_MAP = {...BASE_ACTIVE};
  STARTING_TIER_MAP = {...BASE_STARTING_TIER};
  Object.keys(tagOverridesState).forEach(name=>{
    const o = tagOverridesState[name];
    if(o.tier) TIER_MAP[name] = o.tier;
    if(typeof o.active === 'boolean') ACTIVE_MAP[name] = o.active;
    if(o.startingTier) STARTING_TIER_MAP[name] = o.startingTier;
  });
}

// The list used for rating computation: base + approved submissions, edits applied, deletions removed.
// Every approved match, edits applied, deletions removed. Includes draws -- this is the source
// of truth for "what exists", used for display. Rating computation uses getEffectiveMatches()
// below, which filters draws out, since an unfinished game has no defined winner to rate.
function getAllApprovedMatches(){
  // The v3 `matches` collection is the match history. It is the same 150-match
  // set the engine rated, already carrying every correction and deletion that
  // was applied in production, so the record shown beside a rating and the
  // record that produced it are one history rather than two.
  //
  // BASE_MATCHES is no longer read here. It is the pre-v3 base layer: 127
  // June-August matches with no September and no draws, and reading it was the
  // cause of the 127-vs-150 divergence.
  //
  // The legacy edit/deletion overlays are likewise not applied. v3 match
  // documents are already the edited truth, and re-applying an overlay would
  // desync a match from the rating computed for it. Historical editing stays
  // unavailable until replay-forward exists.
  let all = V3_MATCHES.slice();
  // Every calculated statistic in the app -- ratings, monthly ratings,
  // win/loss, league points, form, partnerships, head-to-head,
  // recommendations, call-outs -- is derived from this function (directly, or
  // via getEffectiveMatches/getDisplayMatches), so no screen can ever end up
  // calculating against a different dataset than another.
  //
  // The Data Range setting is deliberately NOT applied here. It changes what
  // the match-history view shows and nothing else; HISTORICAL_DISPLAY_MATCHES
  // is added in getDisplayMatches() alone. No calculation can reach it.
  return all;
}

// The list used for rating computation: same as above, minus draws (no winner to rate).
function getEffectiveMatches(){
  return getAllApprovedMatches().filter(m => !m.isDraw);
}

// The list used for the Games tab display: all approved matches (including draws) + pending, never deleted.
// This is the ONLY place the Data Range setting is read, and the only place
// HISTORICAL_DISPLAY_MATCHES is surfaced. Nothing downstream of here feeds a
// rating, a Rating Journey event, or a Monthly Performance figure.
function getDisplayMatches(){
  const effective = getAllApprovedMatches().map(m=>({...m, _status:'approved'}));
  const pending = extraMatchesState.filter(m=>m.status==='pending' && !deletedIdsState.includes(m.id)).map(m=>({...m, _status:'pending'}));
  const historical = dataRange === 'all'
    ? HISTORICAL_DISPLAY_MATCHES.map(m=>({...m, _status:'approved', _displayOnly:true}))
    : [];
  return effective.concat(pending).concat(historical);
}

// ===================== LEGACY RATING ENGINE (no callers) ==================
// The pre-v3 joint solver. Nothing in the application calls it any more: the
// last two screens that did -- the Monthly Rating breakdown and the
// head-to-head month view -- now read the persisted trajectory.
//
// It is kept rather than deleted because Shaun's decision was that the legacy
// solver stays available through the beta for comparison. It is no longer
// reachable from the UI, and must not be wired back into any display: a screen
// showing a v3 rating next to a legacy-derived figure is how the "story
// estimate" problem started.
function computeElo(matches, tierMap, startingTierMap){
  startingTierMap = startingTierMap || {};
  const ratings = {};
  function R(name){
    if(!(name in ratings)) ratings[name] = TIER_SEED[startingTierMap[name] || tierMap[name] || 'B'];
    return ratings[name];
  }
  const K = 28, EPOCHS = 300;
  for(let epoch=0; epoch<EPOCHS; epoch++){
    for(const m of matches){
      const gw = m.sets.reduce((s,set)=>s+set[0],0);
      const gl = m.sets.reduce((s,set)=>s+set[1],0);
      const total = (gw+gl) || 1;
      const actual = gw/total;
      const wr = m.winners.reduce((s,p)=>s+R(p),0)/m.winners.length;
      const lr = m.losers.reduce((s,p)=>s+R(p),0)/m.losers.length;
      const expected = 1/(1+Math.pow(10,(lr-wr)/400));
      const delta = K*(actual-expected)/EPOCHS*3;
      m.winners.forEach(p=>{ ratings[p] = R(p) + delta; });
      m.losers.forEach(p=>{ ratings[p] = R(p) - delta; });
    }
  }
  return ratings;
}

// Attaches what the engine recorded for each match. Nothing here is derived
// from today's ratings: the team ratings are the ones carried INTO the match,
// and the expectation is the one the engine used at the time. Recomputing a
// historical expectation in the browser is forbidden, and it was also simply
// unstable -- the same June match reported a different expectation every time
// anybody played.
//
// `expected_score` and `actual_score` are the engine's performance scores
// (0.80 x game share + 0.20 x the result). They are NOT a share of games, and
// are named so they cannot be mistaken for `game_share_winner`, which is.
// The v3 RATED match set, in the shape PlayerState reads: every match the
// engine actually rated, draws included, with the players it moved. Built from
// the recorded MATCH_UPDATE events rather than from MATCHES, which deliberately
// excludes draws -- counting only decided games made a player's eligibility
// depend on whether their recent matches happened to finish.
// The tier a player was in ON THE DATE of a match -- not their tier today. A
// promotion recorded in August means an old June card shows the tier they were
// actually in when they played it, which is the point.
function historicalTierOf(name, date){
  if(!V3_TIER_AS_OF) return null;
  return V3_TIER_AS_OF(name, date) || null;
}

// What kind of match this was, in tier terms, from the same temporal source as
// the labels. Returns null when any player's tier is unknown at that date.
function gameTypeOf(m){
  if(typeof GameType === 'undefined' || !V3_TIER_AS_OF) return null;
  const tiersOf = (names) => names.map(n => historicalTierOf(n, m.date));
  return GameType.classify(tiersOf(m.winners), tiersOf(m.losers));
}

// "Eli (A) & Len (A)" -- names with the tier they held that day.
// Reads a partnership out in canonical order: the stronger tier first, stored
// order kept when partners share a tier. The two SIDES are never swapped --
// on a decided card the first side is the side that won, and on a draw it is
// the side the score is written from, so reordering them would turn a loss
// into a win or a scoreline inside out.
function namesWithHistoricalTier(names, date, ratings){
  const ordered = (typeof GameType !== 'undefined' && GameType.orderTeam)
    ? GameType.orderTeam(names, (n) => historicalTierOf(n, date))
    : names;
  return ordered.map(n => {
    const t = historicalTierOf(n, date);
    const tier = t ? ` <span class="hist-tier">(${t})</span>` : '';
    const r = ratings ? ratings(n) : null;
    return `${n}${tier}${r === null || r === undefined ? '' : ` ${r}`}`;
  }).join(' &amp; ');
}

function v3RatedMatchList(){
  return Object.values(V3_MATCH_FACTS || {}).map(f => ({
    date: f.date,
    players: Object.keys(f.byPlayer || {}),
  }));
}

// One player's Ranked / Idle / Inactive state, from the one helper. Every
// surface that shows a rank, a rank dash or a status tag goes through here.
function playerStateOf(name, asOf){
  if(typeof PlayerState === 'undefined') return null;
  const p = PLAYERS.find(x => x.name === name);
  return PlayerState.stateOf({
    ratedMatches: v3RatedMatchList(),
    name,
    asOf: asOf === undefined ? Date.now() : asOf,
    active: p ? p.active !== false : true,
  });
}

// ===================== TIER RANK: ONE DEFINITION =====================
// Tier Rank is a player's position in the CURRENT Power Rankings among the
// players in their current tier -- the same pool and the same order as the
// Rankings list at All time:
//   pool   players who are rankable (PlayerState RANKED; Idle and Inactive
//          are not ranked). The min-games number on the list is a display
//          filter, not eligibility, so it plays no part here.
//   order  current Power Rating, highest first, the list's own comparator
//          over the same PLAYERS order (so ties fall the same way).
// Every surface that says "Tier" beside a rank reads it from here. There used
// to be a second calculation that ranked every tier member, Idle and Inactive
// included, which is how one profile said "#8" and "#9 of 9" at once.
function currentPowerRankings(){
  return PLAYERS.filter(p => { const st = playerStateOf(p.name); return !!(st && st.rankable); })
    .sort((a,b)=> b.rating - a.rating);
}
function tierRankOf(name, list){
  const ranked = list || currentPowerRankings();
  const p = PLAYERS.find(x => x.name === name);
  if(!p) return null;
  const inTier = ranked.filter(x => x.tier === p.tier);
  const idx = inTier.findIndex(x => x.name === name);
  const overall = ranked.findIndex(x => x.name === name);
  return {
    tier: p.tier,
    rank: idx >= 0 ? idx + 1 : null,      // null: not currently ranked
    of: inTier.length,                    // ranked players in the tier
    overallRank: overall >= 0 ? overall + 1 : null,
    overallOf: ranked.length,
  };
}

// Every game actually played, decided or drawn, newest-agnostic. For screens
// that DESCRIBE history. Never for anything that calculates a rating, a win
// percentage or a league point -- those read MATCHES, which is the rated set.
function matchesIncludingDraws(){
  return MATCHES.concat(DRAW_MATCHES);
}

// The meetings between two players, on opposite sides. One definition, used by
// both head-to-head surfaces, so they cannot disagree about what counts as a
// meeting -- and it includes draws, which a pair of `winners/losers` clauses
// silently dropped.
function h2hOpponentMatches(a, b){
  return matchesIncludingDraws().filter(m=>{
    const inA = m.winners.includes(a) || m.losers.includes(a);
    const inB = m.winners.includes(b) || m.losers.includes(b);
    if(!inA || !inB) return false;
    const sameSide = (m.winners.includes(a) && m.winners.includes(b))
      || (m.losers.includes(a) && m.losers.includes(b));
    return !sameSide;
  });
}

function h2hTeammateMatches(a, b){
  return matchesIncludingDraws().filter(m=>
    (m.winners.includes(a) && m.winners.includes(b))
    || (m.losers.includes(a) && m.losers.includes(b)));
}

function enrichMatches(matches){
  return matches.map(m=>{
    const gw = m.sets.reduce((s,set)=>s+set[0],0);
    const gl = m.sets.reduce((s,set)=>s+set[1],0);
    const total = (gw+gl) || 1;
    const facts = V3_MATCH_FACTS[m.id];
    // A rated match with no recorded events is a broken read, not a match to
    // draw an approximate card for.
    if(!facts) throw new Error('No recorded engine facts for match ' + m.id);
    const view = MatchFacts.forPlayer(facts, m.winners[0]);
    if(!view) throw new Error('Match ' + m.id + ' has no event for ' + m.winners[0]);
    return {
      id: m.id, date: m.date, winners: m.winners, losers: m.losers,
      // Both: `score` is the stored winner-first string every neutral caller
      // wants, `sets` is what a player-centric card needs in order to orient.
      sets: m.sets.map(s=>[...s]),
      score: m.sets.map(s=>s.join('-')).join(', '),
      type: m.type, note: m.note||'', verified: m.verified !== false,
      isDraw: !!m.isDraw,
      games_winner: gw, games_loser: gl,
      game_share_winner: Math.round((gw/total)*1000)/1000,
      expected_score: Math.round(view.mine.expected*1000)/1000,
      actual_score: Math.round(view.mine.actual*1000)/1000,
      performance_residual: Math.round(view.mine.residual*1000)/1000,
      team_w_rating: view.mine.preRating, team_l_rating: view.theirs.preRating,
      match_strength: Math.round((view.mine.preRating + view.theirs.preRating)/2*10)/10,
      // Per-player, because K is per-player: the four players in one match do
      // not move by the same amount and must never be shown as if they did.
      deltas: facts.byPlayer,
    };
  });
}

function buildPlayers(enrichedMatches, ratings, tierMap, activeMap){
  const agg = {};
  function A(name){
    if(!agg[name]) agg[name] = {wins:0, losses:0, strengths:[], overperf:[], games_w:0, games_l:0, upset_wins:0, upset_losses:0};
    return agg[name];
  }
  const GAP_THRESHOLD = 15;
  enrichedMatches.forEach(m=>{
    const gap = Math.abs(m.team_w_rating - m.team_l_rating);
    const isClose = gap < GAP_THRESHOLD;
    const winnerFavored = m.team_w_rating > m.team_l_rating;
    const isUpset = !isClose && !winnerFavored;
    m.winners.forEach(p=>{
      const a = A(p);
      a.wins++; a.strengths.push(m.match_strength); a.overperf.push(m.performance_residual);
      a.games_w += m.games_winner; a.games_l += m.games_loser;
      if(isUpset) a.upset_wins++;
    });
    m.losers.forEach(p=>{
      const a = A(p);
      a.losses++; a.strengths.push(m.match_strength); a.overperf.push(-m.performance_residual);
      a.games_w += m.games_loser; a.games_l += m.games_winner;
      if(isUpset) a.upset_losses++;
    });
  });

  const allNames = Object.keys(ratings);
  const byTier = {};
  allNames.forEach(name=>{
    const t = tierMap[name] || 'B';
    (byTier[t] = byTier[t]||[]).push(name);
  });

  const tierAvgRating = {}, tierAvgOpp = {}, tierMinRating = {}, tierMaxRating = {};
  TIER_ORDER_LIST.forEach(t=>{
    const names = byTier[t] || [];
    if(names.length===0) return;
    tierAvgRating[t] = names.reduce((s,n)=>s+ratings[n],0)/names.length;
    const opps = names.map(n=>{
      const a = agg[n];
      return a && a.strengths.length ? a.strengths.reduce((s,x)=>s+x,0)/a.strengths.length : ratings[n];
    });
    tierAvgOpp[t] = opps.reduce((s,x)=>s+x,0)/opps.length;
    tierMinRating[t] = Math.min(...names.map(n=>ratings[n]));
    tierMaxRating[t] = Math.max(...names.map(n=>ratings[n]));
  });

  const PROMO_THRESHOLD = 100, DEMO_THRESHOLD = 100, MIN_GAMES_FOR_RISK = 4;

  const players = [];
  TIER_ORDER_LIST.forEach(t=>{
    const names = (byTier[t]||[]).slice().sort((a,b)=>ratings[b]-ratings[a]);
    names.forEach((name, idx)=>{
      const a = agg[name] || {wins:0,losses:0,strengths:[],overperf:[],games_w:0,games_l:0,upset_wins:0,upset_losses:0};
      const total = a.wins + a.losses;
      const avgStrength = a.strengths.length ? a.strengths.reduce((s,x)=>s+x,0)/a.strengths.length : ratings[name];
      const avgOverperf = a.overperf.length ? 100*a.overperf.reduce((s,x)=>s+x,0)/a.overperf.length : 0;
      const idx0 = TIER_IDX[t];
      const tierAbove = idx0>0 ? TIER_ORDER_LIST[idx0-1] : null;
      const tierBelow = idx0<3 ? TIER_ORDER_LIST[idx0+1] : null;
      const promotionGap = (tierAbove && tierMinRating[tierAbove]!==undefined) ? Math.round((tierMinRating[tierAbove]-ratings[name])*10)/10 : null;
      const demotionGap = (tierBelow && tierMaxRating[tierBelow]!==undefined) ? Math.round((ratings[name]-tierMaxRating[tierBelow])*10)/10 : null;
      const confidence = total < MIN_GAMES_FOR_RISK ? 'low' : (total < 10 ? 'medium' : 'high');
      let risk = 'stable';
      if(confidence==='low') risk='unproven';
      else if(promotionGap!==null && promotionGap<=PROMO_THRESHOLD) risk='promotion_watch';
      else if(demotionGap!==null && demotionGap<=DEMO_THRESHOLD) risk='demotion_watch';

      players.push({
        name, tier: t, rating: Math.round(ratings[name]*10)/10,
        wins: a.wins, losses: a.losses, total, winpct: total? Math.round(1000*a.wins/total)/10 : 0,
        avg_match_strength: Math.round(avgStrength*10)/10, avg_overperf_pct: Math.round(avgOverperf*10)/10,
        game_diff: a.games_w - a.games_l,
        upset_wins: a.upset_wins, upset_losses: a.upset_losses,
        upset_total: a.upset_wins+a.upset_losses,
        upset_rate: total ? Math.round(1000*(a.upset_wins+a.upset_losses)/total)/10 : 0,
        tier_avg_rating: Math.round(tierAvgRating[t]*10)/10,
        rating_vs_tier_avg: Math.round((ratings[name]-tierAvgRating[t])*10)/10,
        tier_avg_opp: Math.round(tierAvgOpp[t]*10)/10,
        opp_vs_tier_avg: Math.round((avgStrength-tierAvgOpp[t])*10)/10,
        promotion_gap: promotionGap, demotion_gap: demotionGap,
        confidence, risk, active: activeMap[name] !== false,
      });
    });
  });
  return players;
}

function buildH2H(enrichedMatches){
  const h2h = {};
  enrichedMatches.forEach(m=>{
    m.winners.forEach(a=>m.losers.forEach(b=>{
      const key=[a,b].sort().join('|');
      h2h[key]=(h2h[key]||0)+1;
    }));
  });
  return h2h;
}

function buildPartnerships(enrichedMatches, tierMap){
  const partnerships = {};
  enrichedMatches.forEach(m=>{
    [[m.winners, true],[m.losers,false]].forEach(([team,isWin])=>{
      if(team.length!==2) return;
      const key = [...team].sort().join('|');
      if(!partnerships[key]) partnerships[key] = {pair: [...team].sort(), games:0, wins:0, losses:0, overperfSum:0};
      const p = partnerships[key];
      p.games++;
      if(isWin){ p.wins++; p.overperfSum += m.performance_residual; }
      else { p.losses++; p.overperfSum += -m.performance_residual; }
    });
  });
  const rows = [];
  Object.values(partnerships).forEach(p=>{
    if(p.games<2) return;
    rows.push({
      pair: p.pair, games: p.games, wins: p.wins, losses: p.losses,
      winpct: Math.round(1000*p.wins/p.games)/10,
      avg_overperf: Math.round(1000*p.overperfSum/p.games)/10,
      tier_a: tierMap[p.pair[0]], tier_b: tierMap[p.pair[1]],
    });
  });
  rows.sort((a,b)=> b.avg_overperf - a.avg_overperf);
  return rows;
}

function buildBestPartner(partnerships){
  const best = {};
  partnerships.forEach(r=>{
    r.pair.forEach((name,i)=>{
      const partner = r.pair[1-i];
      const cur = best[name];
      if(!cur || r.avg_overperf > cur.avg_overperf){
        best[name] = {partner, games:r.games, wins:r.wins, losses:r.losses, winpct:r.winpct, avg_overperf:r.avg_overperf};
      }
    });
  });
  return best;
}

function findWingman(players, targetRating, exclude, sameTier, minGames){
  let best=null;
  players.forEach(p=>{
    if(exclude.has(p.name) || p.total < minGames) return;
    if(sameTier && p.tier!==sameTier) return;
    const gap = Math.abs(p.rating-targetRating);
    if(!best || gap<best.gap) best={gap, p};
  });
  return best ? best.p : null;
}

function buildMatchup(players, focusA, focusB, globalExclude, tier){
  const byName = {}; players.forEach(p=>byName[p.name]=p);
  if(!byName[focusA] || !byName[focusB]) return null;
  const ra=byName[focusA].rating, rb=byName[focusB].rating;
  const exclude = new Set([focusA,focusB,...globalExclude]);

  // Prefer staying within the same tier even with a less-experienced wingman, over reaching
  // outside the tier for someone more proven -- especially matters for thin tiers like C.
  let wingA = tier ? findWingman(players, rb, exclude, tier, 4) : null;
  if(!wingA && tier) wingA = findWingman(players, rb, exclude, tier, 1);
  if(!wingA) wingA = findWingman(players, rb, exclude, null, 4);
  if(!wingA) return null;

  const exclude2 = new Set([...exclude, wingA.name]);
  let wingB = tier ? findWingman(players, ra, exclude2, tier, 4) : null;
  if(!wingB && tier) wingB = findWingman(players, ra, exclude2, tier, 1);
  if(!wingB) wingB = findWingman(players, ra, exclude2, null, 4);
  if(!wingB) return null;

  const team1=[focusA,wingA.name], team2=[focusB,wingB.name];
  const t1r=(ra+wingA.rating)/2, t2r=(rb+wingB.rating)/2;
  return {team1,team2, team1_rating:Math.round(t1r*10)/10, team2_rating:Math.round(t2r*10)/10,
          team_gap: Math.round(Math.abs(t1r-t2r)*10)/10,
          wingA_games: wingA.total, wingB_games: wingB.total};
}

function buildBoundaryTests(activePlayers, h2h){
  const byName = {}; activePlayers.forEach(p=>byName[p.name]=p);
  const names = activePlayers.map(p=>p.name);
  const candidates = [];
  for(let i=0;i<names.length;i++) for(let j=i+1;j<names.length;j++){
    const a=names[i], b=names[j];
    const pa=byName[a], pb=byName[b];
    if(Math.abs(TIER_IDX[pa.tier]-TIER_IDX[pb.tier]) !== 1) continue;
    const gap = Math.abs(pa.rating-pb.rating);
    if(gap>130) continue;
    const minGames = Math.min(pa.total, pb.total);
    if(minGames<3) continue;
    const played = h2h[[a,b].sort().join('|')] || 0;
    candidates.push({a,b, tier_a:pa.tier, tier_b:pb.tier, rating_a:pa.rating, rating_b:pb.rating,
                      gap: Math.round(gap*10)/10, played_before: played, games_a: pa.total, games_b: pb.total});
  }
  candidates.sort((x,y)=> (x.played_before-y.played_before) || (x.gap-y.gap));
  const top = candidates.slice(0,8);
  const focusNames = new Set(); top.forEach(c=>{ focusNames.add(c.a); focusNames.add(c.b); });
  top.forEach(c=>{
    const otherFocus = new Set([...focusNames].filter(n=>n!==c.a && n!==c.b));
    c.matchup = buildMatchup(activePlayers, c.a, c.b, otherFocus);
  });
  return top.filter(c=>c.matchup);
}

function buildCalibrationGames(activePlayers, h2h){
  const lowSample = activePlayers.filter(p=>p.total<4);
  const rows = [];
  lowSample.forEach(p=>{
    let best=null;
    activePlayers.forEach(q=>{
      if(q.name===p.name || q.total<6) return;
      const played = h2h[[p.name,q.name].sort().join('|')] || 0;
      const gap = Math.abs(p.rating-q.rating);
      const score = played*200+gap;
      if(!best || score<best.score) best={score, opponent:q.name, tier:q.tier, rating:q.rating, games:q.total, gap:Math.round(gap*10)/10, played_before:played};
    });
    if(!best) return;
    rows.push({name:p.name, tier:p.tier, rating:p.rating, games:p.total, best_anchor:best});
  });
  rows.sort((a,b)=> a.best_anchor.gap - b.best_anchor.gap);
  rows.forEach(r=>{ r.matchup = buildMatchup(activePlayers, r.name, r.best_anchor.opponent, new Set()); });
  return rows.filter(r=>r.matchup);
}

function buildWithinTierGames(activePlayers, h2h){
  const byTier = {};
  activePlayers.forEach(p=>{ (byTier[p.tier]=byTier[p.tier]||[]).push(p); });
  const picked = [];
  TIER_ORDER_LIST.forEach(t=>{
    const tp = byTier[t]||[];
    if(tp.length<2) return;
    const cands = [];
    for(let i=0;i<tp.length;i++) for(let j=i+1;j<tp.length;j++){
      const p=tp[i], q=tp[j];
      const minGames = Math.min(p.total,q.total);
      if(minGames<3) continue;
      const gap = Math.abs(p.rating-q.rating);
      const played = h2h[[p.name,q.name].sort().join('|')] || 0;
      cands.push({tier:t, a:p.name, b:q.name, rating_a:p.rating, rating_b:q.rating,
                  gap:Math.round(gap*10)/10, games_a:p.total, games_b:q.total, played_before:played});
    }
    // Balance closeness against staleness: a tiny gap that's been played many times is still
    // interesting (a settled rivalry), it shouldn't be buried just because it's not "fresh".
    cands.forEach(c=> c.score = c.gap + c.played_before * 2);
    cands.sort((x,y)=> x.score - y.score);
    picked.push(...cands.slice(0,2));
  });
  const byTierFocus = {};
  picked.forEach(c=>{ (byTierFocus[c.tier]=byTierFocus[c.tier]||new Set()).add(c.a); byTierFocus[c.tier].add(c.b); });
  picked.forEach(c=>{
    const otherFocus = new Set([...byTierFocus[c.tier]].filter(n=>n!==c.a && n!==c.b));
    c.matchup = buildMatchup(activePlayers, c.a, c.b, otherFocus, c.tier);
    if(c.matchup){
      const allP = c.matchup.team1.concat(c.matchup.team2);
      const byName = {}; activePlayers.forEach(p=>byName[p.name]=p);
      const tiersInvolved = [...new Set(allP.map(n=>byName[n].tier))].sort();
      c.matchup.pure_tier = (tiersInvolved.length===1 && tiersInvolved[0]===c.tier);
      c.matchup.tiers_involved = tiersInvolved;
      c.matchup.has_light_wingman = (c.matchup.wingA_games < 4 || c.matchup.wingB_games < 4);
    }
  });
  return picked.filter(c=>c.matchup);
}

function bestPairNear(players, targetRating, exclude){
  let best=null;
  const pool = players.filter(p=>!exclude.has(p.name));
  for(let i=0;i<pool.length;i++) for(let j=i+1;j<pool.length;j++){
    const p=pool[i], q=pool[j];
    const avg=(p.rating+q.rating)/2;
    const gap=Math.abs(avg-targetRating);
    if(!best || gap<best.gap) best={gap, pair:[p.name,q.name], avg_rating:Math.round(avg*10)/10};
  }
  return best ? {pair:best.pair, avg_rating:best.avg_rating, gap_to_target:Math.round(best.gap*10)/10} : null;
}

function buildDifficultySuggestions(allPlayers, activePlayers){
  const diff = {};
  const byTier = {};
  activePlayers.forEach(p=>{ (byTier[p.tier]=byTier[p.tier]||[]).push(p); });

  allPlayers.forEach(p=>{
    const R = p.rating;
    const exclude = new Set([p.name]);
    const tierPeers = (byTier[p.tier]||[]).filter(x=>x.name!==p.name);
    const withinTier = tierPeers.length >= 2;

    let easy, balanced, hard;
    if(withinTier){
      const tierRatings = (byTier[p.tier]||[]).map(x=>x.rating);
      const tierMin = Math.min(...tierRatings), tierMax = Math.max(...tierRatings);
      easy = bestPairNear(tierPeers, tierMin, exclude);
      balanced = bestPairNear(tierPeers, R, exclude);
      hard = bestPairNear(tierPeers, tierMax, exclude);
    } else {
      // not enough same-tier players (e.g. Manny, the only Tier S player) -- fall back to any tier
      easy = bestPairNear(activePlayers, R-150, exclude);
      balanced = bestPairNear(activePlayers, R, exclude);
      hard = bestPairNear(activePlayers, R+150, exclude);
    }

    diff[p.name] = {
      easy, balanced, hard, withinTier,
      crossTier: bestPairNear(activePlayers, R, exclude), // best overall-rating match regardless of tier
    };
  });
  return diff;
}

// ===================== v3 APPLICATION STATE =====================
// V3_STATE is loaded once at start-up from the beta `players` collection and is
// the source of every Power Rating the application shows. The legacy solver is
// still present for beta diagnostics but no longer feeds the UI.
let V3_STATE = (typeof V3Bridge !== 'undefined') ? V3Bridge.createState() : { loaded:false, error:'v3Bridge.js did not load', players:{} };
let V3_MATCHES = [];   // the v3 `matches` collection, in the shape the app reads
let V3_JOURNEY = [];   // the Rating Journey -- monthly views only, never player state
let V3_MATCH_FACTS = {}; // matchId -> what the engine did in that match, read back
// The authoritative "what tier was this player in on this date" lookup, built
// from the RECORD. Hoisted so the Games tab labels and the game-type filter use
// the same source as the monthly views -- a label and a classification that
// disagreed would be worse than either alone.
let V3_TIER_AS_OF = null;
let V3_TIER_HISTORY = null;
// The record as stored, kept for one purpose: checking that replaying it still
// reproduces it. Assembled from documents the load already read.
let V3_RECORD = null;
// The divergence found this session, if any. One check per session -- it is
// pure arithmetic over data already in memory, but it replays the whole
// history, so it runs once and off the critical path.
let healthReport = null;
let healthCheckDone = false;
let MONTHLY_VIEWS = null;
let PRODUCTION_SNAPSHOT_INDEX = (typeof PRODUCTION_SNAPSHOT !== 'undefined' && typeof V3Bridge !== 'undefined')
  ? V3Bridge.indexSnapshot(PRODUCTION_SNAPSHOT) : {};

// The frozen identity behind a display name. EVERYTHING that writes to the
// record -- a new match, a club decision, a historical adjustment -- must go
// through this first. A display name written into the record would be a new
// player as far as the engine is concerned.
function playerIdFor(name){
  if(V3_STATE && V3_STATE.alias) return PlayerNames.toId(V3_STATE.alias, name);
  return name;
}

// …and the reverse, for the rare place that holds a stored id and needs to
// show it (the admin audit trail, mostly).
function displayNameFor(playerId){
  if(V3_STATE && V3_STATE.alias) return PlayerNames.toDisplay(V3_STATE.alias, playerId);
  return playerId;
}

async function loadV3State(){
  if(!db){ V3_STATE = {loaded:false, error:'No database connection.', players:{}}; }
  else {
    // All three collections are asked for at once. v3Bridge still awaits them
    // in order -- see RatingStore.prefetchedBackend for why that is now free.
    const backend = RatingStore.prefetchedBackend(
      RatingStore.firestoreCompatBackend(db), ['players', 'matches', 'ratingJourney']);
    V3_STATE = await PerfTrace.timeAsync('read players', V3Bridge.load(backend));
    if(V3_STATE.loaded){
      try {
        const rawMatches = {};
        const rawJourney = {};
        V3_MATCHES = await PerfTrace.timeAsync('read matches', V3Bridge.loadMatches(backend, rawMatches, V3_STATE.alias));
        // Loaded at start-up rather than lazily because the app opens on a
        // monthly view, so a lazy read would fire immediately anyway.
        V3_JOURNEY = await PerfTrace.timeAsync('read ratingJourney', V3Bridge.loadJourney(backend, rawJourney, V3_STATE.alias));
        // Tiers come from v3 state, NOT from TIER_MAP. TIER_MAP is still {} at
        // this point -- rebuildMapsFromState() has not run yet -- and an empty
        // map made tierAsOf() answer `undefined` for every player who was not
        // in the authoritative change list, which silently emptied every
        // historical tier, within-tier rank and tierChanged flag in the app.
        // TierHistory.create() now rejects an empty map so this cannot recur
        // quietly, but the right source was always v3's own tiers.
        // What the engine did in each match, so no screen has to re-derive an
        // expectation, a pre-match rating or a rating change from today's state.
        V3_MATCH_FACTS = PerfTrace.time('MatchFacts.index', ()=> MatchFacts.index(V3_JOURNEY));
        // Tier changes come from the RECORD, not from the seed's frozen list.
        // With the list, the first real promotion the club records makes the
        // current tier disagree with the history and the consistency guard
        // refuses to load the app at all.
        // The whole history, not just the lookup: the League Table needs to
        // know WHEN a player changed tier, not only what they were on a given
        // day. Sampling dates to find that out would miss a second change in
        // the same month.
        V3_TIER_HISTORY = TierHistory.create({
          currentTiers: V3Bridge.tierMap(V3_STATE),
          changes: TierHistory.changesFromJourney(V3_JOURNEY),
        });
        V3_TIER_AS_OF = V3_TIER_HISTORY.tierAsOf;
        MONTHLY_VIEWS = PerfTrace.time('MonthlyViews.build', ()=> MonthlyViews.build(V3_JOURNEY, { tierAsOf: V3_TIER_AS_OF }));
        // The record in its stored form, which is what a replay is verified
        // against. Assembled from documents already read; it costs nothing.
        // The record in its STORED form -- ids, not labels. Everything above
        // works in labels; the replay verifier, the repair planner and the
        // diagnostics must see exactly what is in Firestore, or a renamed
        // player looks like a player who has vanished and been replaced.
        V3_RECORD = { matches: rawMatches.raw || [], journey: rawJourney.raw || [], players: V3_STATE.rawPlayerDocs || [] };
      }
      catch(e){
        V3_MATCHES = []; V3_JOURNEY = []; MONTHLY_VIEWS = null;
        V3_MATCH_FACTS = {}; V3_TIER_AS_OF = null; V3_TIER_HISTORY = null; V3_RECORD = null;
        V3_STATE = {...V3_STATE, loaded:false, error:'Could not read v3 history: ' + e.message};
      }
    }
  }
  if(!V3_STATE.loaded) console.error('v3 state failed to load:', V3_STATE.error);
  renderV3StatusBanner();
  return V3_STATE;
}

// Without this the app just renders "No players match that filter", which reads
// as a filter problem rather than a failed rating load. A beta comparing two
// rating systems cannot afford an ambiguous empty state.
function renderV3StatusBanner(){
  const id = 'v3StatusBanner';
  document.getElementById(id)?.remove();
  if(V3_STATE.loaded) return;
  const el = document.createElement('div');
  el.id = id;
  el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#5b1a17;color:#ffd9d6;'
    + 'padding:10px 14px;font-size:13px;line-height:1.4;border-bottom:1px solid #8a2a25;';
  el.innerHTML = '<b>Power Ratings unavailable.</b> v3 player state could not be loaded, so no rating is shown. '
    + 'The legacy rating has deliberately not been substituted.<br><span style="opacity:.8;font-size:12px;">'
    + String(V3_STATE.error || 'Unknown error') + '</span>';
  document.body.appendChild(el);
}

function recomputeAll(){
  return PerfTrace.time('recomputeAll', recomputeAllNow);
}

function recomputeAllNow(){
  rebuildMapsFromState();
  ALL_MATCHES = getEffectiveMatches();

  // If v3 state is unavailable the application shows nothing rather than
  // something plausible. It must never quietly fall back to the legacy solver,
  // to a tier seed, or to 1400 -- a believable wrong number is the worst
  // outcome for a beta whose entire purpose is comparing two rating systems.
  if(!V3_STATE.loaded){
    PLAYERS = []; MATCHES = []; DRAW_MATCHES = []; ALL_MATCHES = []; H2H = {}; PARTNERSHIPS = []; BEST_PARTNER = {};
    BOUNDARY_TESTS = []; CALIBRATION_GAMES = []; WITHIN_TIER_GAMES = []; DIFFICULTY_SUGGESTIONS = {};
    INACTIVE_PLAYERS = new Set();
    return;
  }

  const ratings = V3Bridge.ratingsMap(V3_STATE);
  // Tier comes from v3 too, so a rating and the tier shown beside it always
  // describe the same state.
  const v3Tiers = V3Bridge.tierMap(V3_STATE);
  Object.keys(v3Tiers).forEach(n=>{ TIER_MAP[n] = v3Tiers[n]; });

  // NOTE (migration task): enrichMatches recomputes expectations from CURRENT
  // ratings. Those values are legacy-derived and are NOT v3 pre-match
  // expectations, which live in ratingJourney. They must not be presented as
  // such, and this function is scheduled for replacement.
  MATCHES = enrichMatches(ALL_MATCHES);
  // Drawn matches, enriched the same way, kept in their own list.
  //
  // MATCHES deliberately holds only the matches the RATING is computed from,
  // and a draw has no winner to rate, so it is not in there -- and must not
  // be, or every win/loss total in the club would move. But a draw is still a
  // game that was played, and a screen showing a player's history, a
  // head-to-head or a doughnut has no business pretending it did not happen.
  // So the screens that describe games ask for this as well, and the ones
  // that calculate do not.
  DRAW_MATCHES = enrichMatches(getAllApprovedMatches().filter(m => m.isDraw));
  PLAYERS = buildPlayers(MATCHES, ratings, TIER_MAP, ACTIVE_MAP);
  PLAYERS.forEach(p=>V3Bridge.decoratePlayer(p, V3_STATE, PRODUCTION_SNAPSHOT_INDEX));

  // v3 rates draws; wins/losses cannot. Counting them here is what makes a
  // player's record reconcile with the evidence behind their rating:
  // wins + losses + draws === lifetimeMatches.
  const drawCounts = {};
  getAllApprovedMatches().filter(m=>m.isDraw).forEach(m=>{
    [...m.winners, ...m.losers].forEach(n=>{ drawCounts[n] = (drawCounts[n]||0) + 1; });
  });
  PLAYERS.forEach(p=>{
    p.draws = drawCounts[p.name] || 0;
    p.recordTotal = p.wins + p.losses + p.draws;
    p.recordReconciles = (p.lifetimeMatches === undefined) || (p.recordTotal === p.lifetimeMatches);
  });
  PLAYERS.forEach(p=>{
    const form = computeRecentForm(p.name, 10);
    p.recent_form = form ? form.avgPct : null;
    p.recent_form_games = form ? form.games : 0;
    p.recent_form_wins = form ? form.wins : 0;
    p.recent_form_losses = form ? form.losses : 0;
    p.recent_form_days_ago = form ? form.daysSinceLastGame : null;
    p.recent_form_stale = form ? form.daysSinceLastGame > RECENT_FORM_STALE_DAYS : false;
  });
  H2H = buildH2H(MATCHES);
  PARTNERSHIPS = buildPartnerships(MATCHES, TIER_MAP);
  BEST_PARTNER = buildBestPartner(PARTNERSHIPS);
  INACTIVE_PLAYERS = new Set(PLAYERS.filter(p=>!p.active).map(p=>p.name));
  const activePlayers = PLAYERS.filter(p=>p.active);
  BOUNDARY_TESTS = buildBoundaryTests(activePlayers, H2H);
  CALIBRATION_GAMES = buildCalibrationGames(activePlayers, H2H);
  WITHIN_TIER_GAMES = buildWithinTierGames(activePlayers, H2H);
  DIFFICULTY_SUGGESTIONS = buildDifficultySuggestions(PLAYERS, activePlayers);
  const monthSelectEl = document.getElementById('monthSelect');
  if(monthSelectEl) populateMonthSelect(monthSelectEl, selectedMonth);
}


const TIERS = ["All","S","A","B","C"];
let activeTab = "power";
let activeTier = "All";
let activeSort = "wins";
let activeSortP = "rating";
let query = "";
let minGames = 10;
// Two independent toggles over the ranking pool. Off, the list is the official
// current ranking pool -- Ranked and Active. On, that group is MERGED into the
// same ordered list and given a filtered-view rank position, keeping its badge
// so the real state stays visible. A separate section underneath answered a
// different question ("who else exists") than the one being asked ("where would
// they sit"), which is why this replaced it.
//
// Neither toggle changes official eligibility, participation, stored ratings or
// history. They change which pool is being looked at, and nothing else.
let includeIdle = false;
let includeInactive = false;

// ===================== WHO OWNS WHICH MONTH =====================
// `selectedMonth` belongs to POWER RANKINGS and to nothing else: the list, the
// podium, Kings of Tiers, the tier badge and the month select above them. It
// opens on the last completed month because a finished month is the
// competition Rankings is showing.
//
// Every other screen that has a month owns its own, and none of them may read
// or write this one:
//
//   Power Rankings                 selectedMonth  Meaningful Month
//   League / Merit / Information   summaryMonth   Meaningful Month
//   Home's monthly card            (no control)   Meaningful Month
//   Games                          gamesMonth     All time
//   Compare (head-to-head)         h2hMonth       All time
//   Player Profile                 profileMonth   All time, on every open
//   Last 10, current rating, the   (none)         rolling / current -- never
//   profile's current state                       a month at all
//
// MEANINGFUL MONTH (meaningfulMonth.js): the current month once it holds five
// canonical matches, otherwise the most recently completed month. It replaced
// "always last month", which solved the empty-1st-of-the-month problem by the
// calendar and so went on opening August on the 25th of September.
//
// A screen that uses it keeps TWO things apart, never one:
//   ...MonthChoice   what the reader picked with the month control, or null
//   ...MonthDefault  the Meaningful Month, evaluated when they ARRIVE and then
//                    held while they stay -- so a fifth game landing mid-read
//                    does not move the page under them
// and shows the choice if there is one, else the default. A choice lasts the
// session; arriving again without one re-evaluates the default.
//
// This was ONE variable once, set by whoever touched a month select last, and
// that was harmless while a person chose it. It stopped being harmless when
// Rankings began choosing it automatically at start-up: from then on every
// screen that shared it inherited "August" from a view the reader had never
// opened. Games was the first to show it and got its own month; Home's
// "View match" was worked around; the Player Profile went on opening as an
// August snapshot for everybody until this was fixed at the root. A
// source-level test now fails the build if anything outside Rankings touches
// `selectedMonth`.
let selectedMonth = 'all';          // what Rankings SHOWS: the choice, else the default
let rankingsMonthChoice = null;     // what the reader picked, or null
let rankingsMonthDefault = null;    // MeaningfulMonth.evaluate(), pinned on arrival
let summaryMonthChoice = null;
let summaryMonthDefault = null;
let homeMonthDefault = null;        // Home has no control: a default and nothing else

// The canonical count the rule runs on: rated/completed matches, draws
// included, pending and display-only history excluded.
function meaningfulMonthNow(){
  return MeaningfulMonth.evaluate({ now: new Date(), matches: getAllApprovedMatches() });
}

// Rankings' month moves between All time and a month by the same rule the
// month control has always followed: a month means the monthly min-games
// default, All time the overall one.
function applyRankingsMonth(month){
  const wasAll = selectedMonth === 'all';
  const isNowAll = month === 'all';
  selectedMonth = month;
  if(wasAll && !isNowAll) setMinGames(5);
  else if(!wasAll && isNowAll) setMinGames(10);
  const sel = document.getElementById('monthSelect');
  if(sel && [...sel.options].some(o => o.value === month)) sel.value = month;
}

// Arriving at Rankings. A reader who has chosen gets their choice back; one
// who has not gets the Meaningful Month as it stands NOW, which is the only
// moment it is re-evaluated.
function arriveAtRankings(){
  if(rankingsMonthChoice !== null && (rankingsMonthChoice === 'all' || getAvailableMonths().includes(rankingsMonthChoice))){
    applyRankingsMonth(rankingsMonthChoice);
    return;
  }
  rankingsMonthChoice = null;
  rankingsMonthDefault = meaningfulMonthNow();
  applyRankingsMonth(rankingsMonthDefault.month);
}

function arriveAtSummary(){
  if(summaryMonthChoice !== null && (summaryMonthChoice === 'all' || getAvailableMonths().includes(summaryMonthChoice))){
    summaryMonth = summaryMonthChoice;
    return;
  }
  summaryMonthChoice = null;
  summaryMonthDefault = meaningfulMonthNow();
  summaryMonth = summaryMonthDefault.month;
}

// Home has no month control, so it only ever shows its default -- pinned when
// Home is arrived at, held through redraws. An empty club has no completed
// month; Home then shows the current one rather than "All time", which is not
// a month a card headed "<Month> at Money Padel" can be about.
function homeMonth(){
  if(!homeMonthDefault) homeMonthDefault = meaningfulMonthNow();
  return homeMonthDefault.month === 'all' ? homeMonthDefault.current : homeMonthDefault.month;
}
function arriveAtHome(){ homeMonthDefault = null; }

// The understated line that says why a screen opened on last month: "October
// is taking shape · 3 of 5 games". Only while the screen is showing its
// DEFAULT, only while the current month is still thin, and only once it has
// at least one game -- on the 1st there is nothing to explain and nothing to
// offer. The month name is a way in: tapping it chooses the current month.
function meaningfulMonthNoteHtml(defaultInfo, showing, choiceId, interactive){
  if(!defaultInfo || defaultInfo.reason !== 'current-too-thin') return '';
  if(showing !== defaultInfo.month) return '';
  if(defaultInfo.currentCount < 1) return '';
  const name = MeaningfulMonth.monthLabel(defaultInfo.current).split(' ')[0];
  // Home has no month control, so its line is only a line.
  const lead = interactive === false
    ? `<span>${name}</span>`
    : `<button type="button" class="mm-note-link" id="${choiceId}Current" data-month="${defaultInfo.current}">${name}</button>`;
  return `<div class="mm-note" id="${choiceId}Note">${lead} is taking shape · ${defaultInfo.currentCount} of ${defaultInfo.threshold} games</div>`;
}

// Tapping the month in that line CHOOSES it, exactly as the month control
// would -- the current month is always there to be picked, five games or not.
function wireMeaningfulMonthNote(choiceId, choose){
  const link = document.getElementById(`${choiceId}Current`);
  if(link) link.onclick = ()=> choose(link.dataset.month);
}
// The Play history keeps its OWN month, and it stays on All time. Rankings and
// the monthly views deliberately open on the last completed month; the results
// feed is a history you scroll, not a month you inspect, and Shaun's decision
// is that it does not follow them. Sharing `selectedMonth` meant the boot-time
// rankings default silently became the Games default too, so Games opened on
// August rather than All time.
let gamesMonth = 'all';
// Tier composition of the four players on the day: 'all', 'cat:ALL_A',
// 'match:AB vs BB', and so on. Layers with Month and Player rather than
// replacing either.
let gamesType = 'all';
// Up to four players, as CANONICAL IDS, in no particular order. A match has
// to contain all of them to be shown.
//
// Ids rather than the names on screen: a player's name is a label an admin can
// change, and matching on labels would mean renaming Rishi silently emptied
// every search that mentioned him. See playerFilter.js.
let gamesPlayerIds = [];
// What the selector wants to say about what was just typed -- an unrecognised
// name, or the same player twice. Held in state rather than written straight
// into the panel, because applying a filter re-renders the panel and would
// wipe the note before anybody read it.
let gamesPlayersNote = '';

// The Games filters arrive shut. Three full-width selects sat above the match
// log on every visit, and the log is what the screen is for. Not persisted:
// the screen should open the same way every time. Whatever the filters are
// set to is written on the closed heading, so shut is never silent.
let gamesFiltersOpen = false;

// ---- Data Range: app-wide dataset setting, not a per-screen filter --------
// 'verified' -- June 2026 onwards only, cross-checked. The default, and the
//               recommended experience.
// 'all'      -- full history, including pre-June 2026 matches that were
//               single-sourced and may be incomplete or less reliable.
// Lives in More > Data & Rankings, is persisted per device, and is applied in
// exactly one place (getAllApprovedMatches) so every screen agrees.
const DATA_RANGE_STORAGE_KEY = 'moneypadel_data_range';
const DATA_RANGE_ACK_KEY = 'moneypadel_data_range_full_ack';

function readStoredDataRange(){
  // localStorage can be unavailable/restricted (private browsing, PWA edge
  // cases) -- degrade to the recommended default rather than failing.
  try {
    return localStorage.getItem(DATA_RANGE_STORAGE_KEY) === 'all' ? 'all' : 'verified';
  } catch(e){ return 'verified'; }
}

let dataRange = readStoredDataRange();

function setDataRange(value){
  dataRange = (value === 'all') ? 'all' : 'verified';
  try { localStorage.setItem(DATA_RANGE_STORAGE_KEY, dataRange); } catch(e){ /* choice just won't persist */ }
}

function hasAcknowledgedFullHistory(){
  try { return localStorage.getItem(DATA_RANGE_ACK_KEY) === '1'; } catch(e){ return false; }
}

function acknowledgeFullHistory(){
  try { localStorage.setItem(DATA_RANGE_ACK_KEY, '1'); } catch(e){}
}

function getAvailableMonths(){
  const months = new Set();
  getDisplayMatches().forEach(m=> months.add(m.date.slice(0,7)));
  return [...months].sort();
}

// "Which month should a monthly view open on" used to live here as
// getDefaultRankingsMonth(): always the previous calendar month. It is now the
// Meaningful Month rule (meaningfulMonth.js), evaluated per screen on arrival
// -- see "WHO OWNS WHICH MONTH" above. Deleted rather than left beside it, so
// there is one rule and nothing to drift back to.

// Month selection and Data Range are deliberately separate concepts: the
// range decides which matches exist at all, the month decides which slice of
// them you're inspecting. Narrowing the range can therefore strand a month
// that no longer has any data behind it (e.g. sitting on May 2026 and
// switching back to Verified). Rather than silently widening the dataset
// again, drop back to the normal default month for whatever data is now
// available.
function reconcileSelectedMonth(){
  if(selectedMonth === 'all') return false;
  if(getAvailableMonths().includes(selectedMonth)) return false;
  // The month shown no longer exists in this dataset. If the reader chose it,
  // the choice has nothing left to point at; either way the screen goes back
  // to its default, re-evaluated.
  rankingsMonthChoice = null;
  arriveAtRankings();
  return true;
}

function monthLabel(ym){
  const names = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const [y,m] = ym.split('-');
  return names[parseInt(m)-1] + ' ' + y;
}
function dayLabel(ymd){
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [y,m,d] = ymd.split('-').map(Number);
  const dt = new Date(y, m-1, d);
  return `${days[dt.getDay()]}, ${d} ${months[m-1]} ${y}`;
}
function computeMonthlyStats(month){
  const filtered = month==='all' ? MATCHES : MATCHES.filter(m=>m.date.slice(0,7)===month);
  // Judge opponent strength and upset status using each player's rating AS OF this specific
  // month, not their season-long rating -- otherwise "avg opp." and "upset" would be judged by
  // a different yardstick than the Month Rating headline number sitting right next to them.
  const monthlyRatings = month==='all' ? {} : monthEndRatings(month);
  function ratingFor(name){
    if(name in monthlyRatings) return monthlyRatings[name];
    const p = PLAYERS.find(x=>x.name===name);
    // No silent 1400. A missing player is a real fault and must surface as one
    // rather than as a plausible-looking rating.
    if(!p) throw new Error(`No rating available for ${name} — v3 state is missing this player.`);
    return p.rating;
  }
  const agg = {};
  function A(name){
    if(!agg[name]) agg[name] = {wins:0, losses:0, strengths:[], overperf:[], games_w:0, games_l:0, upset_wins:0, upset_losses:0};
    return agg[name];
  }
  const GAP_THRESHOLD = 15;
  filtered.forEach(m=>{
    const winnerTeamRating = m.winners[1] ? (ratingFor(m.winners[0]) + ratingFor(m.winners[1])) / 2 : ratingFor(m.winners[0]);
    const loserTeamRating = m.losers[1] ? (ratingFor(m.losers[0]) + ratingFor(m.losers[1])) / 2 : ratingFor(m.losers[0]);
    const monthMatchStrength = (winnerTeamRating + loserTeamRating) / 2;
    const gap = Math.abs(winnerTeamRating - loserTeamRating);
    const isClose = gap < GAP_THRESHOLD;
    const winnerFavored = winnerTeamRating > loserTeamRating;
    const isUpset = !isClose && !winnerFavored;
    m.winners.forEach(p=>{
      const a = A(p);
      a.wins++; a.strengths.push(monthMatchStrength); a.overperf.push(m.performance_residual);
      a.games_w += m.games_winner; a.games_l += m.games_loser;
      if(isUpset) a.upset_wins++;
    });
    m.losers.forEach(p=>{
      const a = A(p);
      a.losses++; a.strengths.push(monthMatchStrength); a.overperf.push(-m.performance_residual);
      a.games_w += m.games_loser; a.games_l += m.games_winner;
      if(isUpset) a.upset_losses++;
    });
  });
  const stats = {};
  Object.keys(agg).forEach(name=>{
    const a = agg[name];
    const total = a.wins+a.losses;
    const avgStrength = a.strengths.length ? a.strengths.reduce((s,x)=>s+x,0)/a.strengths.length : 0;
    const avgOverperf = a.overperf.length ? 100*a.overperf.reduce((s,x)=>s+x,0)/a.overperf.length : 0;
    stats[name] = {
      wins:a.wins, losses:a.losses, total, winpct: total?Math.round(1000*a.wins/total)/10:0,
      avg_match_strength: Math.round(avgStrength*10)/10, avg_overperf_pct: Math.round(avgOverperf*10)/10,
      game_diff: a.games_w-a.games_l,
      upset_wins:a.upset_wins, upset_losses:a.upset_losses, upset_total:a.upset_wins+a.upset_losses,
      upset_rate: total?Math.round(1000*(a.upset_wins+a.upset_losses)/total)/10:0,
    };
  });
  return stats;
}

// A genuine tier-seeded rating computed from ONLY the given month's matches -- as if that month
// were its own month-end snapshot of the one continuous rating. (The former
// restricted match set. Players with no games that month simply won't appear in the result.
// The real Power Rating each player held at that month's close, taken from the
// chronological Sequential-v1 trajectory. This REPLACES the retired
// computeMonthlyRating, which solved a separate monthly rating of its own.
// There is no monthly solver any more and there must not be one again.
// Which tier a player was in for the scope currently on screen. In a month view
// that is the tier they held at that month's close -- the same tier the monthly
// within-tier ranks use -- never the tier they hold today. Promoting someone in
// September must not rewrite them into Tier B's June honours board.
//
// Returns null when the selected month has no record of the player, which is
// deliberate: they are then absent from a tier-filtered view rather than being
// filed under a tier they did not hold.
function tierInScope(player){
  if(selectedMonth === 'all') return player.tier;
  if(!MONTHLY_VIEWS) return null;
  const row = MonthlyViews.playerMonth(MONTHLY_VIEWS, selectedMonth, player.name);
  return row ? row.tierAtMonthEnd : null;
}

function matchesActiveTier(player){
  return activeTier === 'All' || tierInScope(player) === activeTier;
}

// ---- Monthly stories -------------------------------------------------------
// Three distinct measures, never merged: where the real Power Rating stood and
// how far it moved, how the rank moved, and how far play beat expectation.
function monthlyMovementIndex(month){
  if(month === 'all' || !MONTHLY_VIEWS) return {};
  const m = MONTHLY_VIEWS.byMonth[month];
  if(!m) return {};
  const out = {};
  m.rows.forEach(r=>{ out[r.playerId] = r; });
  return out;
}

// The monthly stories panel. Four separate views, deliberately separated by
// heading so Monthly Performance is never read as rating movement or vice
// versa. League Table is untouched and stays on its own tab.
// Independent of the League table disclosures: collapsing one says nothing
// about the other. Not persisted -- the month should open the same way each
// time it is chosen.
let monthlySummaryOpen = true;

function buildMonthlyStoriesHtml(month){
  if(month === 'all' || !MONTHLY_VIEWS || !MONTHLY_VIEWS.byMonth[month]) return '';
  const label = monthLabel(month);
  const perf = MonthlyViews.performanceTable(MONTHLY_VIEWS, month).slice(0,3);
  const moves = MonthlyViews.ratingMovementTable(MONTHLY_VIEWS, month);
  const risers = moves.filter(r=>r.ratingChange>0).slice(0,3);
  const fallers = moves.filter(r=>r.ratingChange<0).slice(-3).reverse();
  const all = MONTHLY_VIEWS.byMonth[month].rows.concat(MONTHLY_VIEWS.byMonth[month].inactiveRows);
  const ranked = all.filter(r=>r.rankChangeOverall !== null && r.rankChangeOverall !== 0)
    .sort((a,b)=>b.rankChangeOverall-a.rankChangeOverall);
  const climbers = ranked.filter(r=>r.rankChangeOverall>0).slice(0,3);
  const sliders = ranked.filter(r=>r.rankChangeOverall<0).slice(-3).reverse();
  const idleMovers = MONTHLY_VIEWS.byMonth[month].inactiveRows
    .filter(r=>r.rankChangeOverall !== null && r.rankChangeOverall !== 0)
    .sort((a,b)=>Math.abs(b.rankChangeOverall)-Math.abs(a.rankChangeOverall)).slice(0,3);
  const crossovers = MONTHLY_VIEWS.byMonth[month].crossovers.slice(0,3);

  const line = (main, sub) => `<div class="ms-line"><span class="ms-main">${main}</span><span class="ms-sub">${sub}</span></div>`;
  const block = (title, explain, body) => body
    ? `<div class="ms-block"><div class="ms-title">${title}</div><div class="ms-explain">${explain}</div>${body}</div>` : '';

  const perfBody = perf.map(r=>line(r.playerId,
    `<span class="${r.monthlyPerformance>0?'perf-pos':'perf-neg'}">${r.performancePct>0?'+':''}${r.performancePct}%</span> vs expectation · ${r.matches} games`)).join('');
  // A rating can move without anyone playing: a club reassessment does it by
  // decision. Saying so here stops a decision reading as a month's form.
  const moveLine = r => line(r.playerId,
    `${Math.round(r.startRating)} → ${Math.round(r.endRating)} · <span class="${r.ratingChange>=0?'perf-pos':'perf-neg'}">${r.ratingChange>0?'+':''}${r.ratingChange} pts</span>`
    + (r.reassessmentChange ? ` <span class="ms-idle">(${r.reassessmentChange>0?'+':''}${r.reassessmentChange} by club decision)</span>` : ''));
  const rankLine = r => line(r.playerId + (r.played ? '' : ' <span class="ms-idle">(no games)</span>'),
    `#${r.startRankOverall} → #${r.endRankOverall} · <span class="${r.rankChangeOverall>0?'perf-pos':'perf-neg'}">${r.rankChangeOverall>0?'▲':'▼'}${Math.abs(r.rankChangeOverall)}</span>`);
  const riseBody = risers.map(moveLine).join('') + fallers.map(moveLine).join('');
  const climbBody = climbers.map(rankLine).join('') + sliders.map(rankLine).join('');
  const idleBody = idleMovers.map(rankLine).join('');
  const crossBody = crossovers.map(c=>line(`${c.overtook} passed ${c.overtaken}`, '')).join('');

  // Collapsible, and collapsible with <details> rather than a toggle this file
  // would have to re-wire on every render. Nothing is removed: all four
  // concepts keep their own heading and their own explanation, they just no
  // longer all compete for the top of the screen.
  const foldBlock = (title, explain, body) => body
    ? `<details class="ms-fold"><summary class="ms-fold-summary">
         <span class="ms-fold-title">${title}</span>
         <span class="ms-fold-explain">${explain}</span>
       </summary><div class="ms-fold-body">${body}</div></details>` : '';

  // Key takeaways deliberately does NOT repeat one table: it takes the single
  // strongest line out of three different stories, so the summary says
  // something the sections below do not each say on their own.
  const takeaways = [];
  if(perf.length){
    takeaways.push({ value: `${perf[0].performancePct>0?'+':''}${perf[0].performancePct}%`,
      positive: perf[0].monthlyPerformance > 0,
      name: perf[0].playerId, note: `Strongest performance (${perf[0].matches} games)` });
  }
  if(risers.length){
    takeaways.push({ value: `${risers[0].ratingChange>0?'+':''}${risers[0].ratingChange} pts`,
      positive: true, name: risers[0].playerId,
      note: risers[0].reassessmentChange ? 'Biggest riser — mostly by club decision' : 'Biggest rating riser' });
  }
  if(climbers.length){
    takeaways.push({ value: `▲${Math.abs(climbers[0].rankChangeOverall)}`, positive: true,
      name: climbers[0].playerId,
      note: `Biggest climb · #${climbers[0].startRankOverall} → #${climbers[0].endRankOverall}` });
  }
  const takeawaysHtml = takeaways.length ? `<div class="ms-takeaways">
    <div class="ms-takeaways-head">Key takeaways</div>
    ${takeaways.map(t=>`<div class="ms-takeaway">
      <span class="ms-takeaway-value ${t.positive?'perf-pos':'perf-neg'}">${t.value}</span>
      <span class="ms-takeaway-name">${t.name}</span>
      <span class="ms-takeaway-note">${t.note}</span>
    </div>`).join('')}
  </div>` : '';

  // The whole summary folds as one. It defaults OPEN -- unlike the League
  // explanation, this is content rather than an explanation of content, and a
  // reader arriving at the month wants it. The chevron is the only thing added
  // to the heading: same type, same colour, same spacing, and deliberately not
  // the bordered card treatment that was rejected during the League work.
  const body = `${takeawaysHtml}
    ${block('Monthly Performance', 'Who most beat their pre-match expectation. Its own measure: the podium and Kings of Tiers rank on rating, not on this.', perfBody)}
    ${foldBlock('Rating Movement', 'How far the real Power Rating actually moved — risers and fallers. Not the same question as performance.', riseBody)}
    ${foldBlock('Ranking Movement', 'Overall rank at the start and end of the month — climbs and slides both.', climbBody)}
    ${foldBlock('Moved without playing', 'Rank can move while a player sits out, because others moved around them. Their rating did not change.', idleBody)}
    ${foldBlock('Crossovers', 'Who overtook whom during the month.', crossBody)}
    <div class="ms-foot">League points are a separate record — see the League tab.</div>`;

  // Expanded, this is a content card and stays one -- that treatment was never
  // the objection. Collapsed, a card containing nothing but its own heading IS
  // the bordered dropdown Shaun rejected during the League work, so the chrome
  // comes off and it becomes a tappable line.
  return `<div class="monthly-stories${monthlySummaryOpen ? '' : ' is-collapsed'}">
    <button type="button" class="ms-head ms-head-toggle" id="monthlySummaryToggle"
      aria-expanded="${monthlySummaryOpen}" aria-controls="monthlySummaryBody">
      <span>${label} — monthly summary</span>
      <span class="lg-inline-chev" aria-hidden="true">${monthlySummaryOpen ? '⌄' : '›'}</span>
    </button>
    ${monthlySummaryOpen ? `<div id="monthlySummaryBody">${body}</div>` : ''}
  </div>`;
}

function rankArrowHtml(change){
  if(change === null || change === undefined || change === 0) return '';
  const up = change > 0;
  return ` · <span class="${up?'perf-pos':'perf-neg'}">${up?'▲':'▼'}${Math.abs(change)}</span>`;
}

function monthEndRatings(month){
  if(month === 'all' || !MONTHLY_VIEWS) return {};
  return MonthlyViews.monthEndRatings(MONTHLY_VIEWS, month);
}

// Builds the raw ingredients for a "monthly awards" style recap: games played, wins/losses/draws
// and points (3/win, 1/draw), win% and loss% (of all games that month, draws included in the
// denominator), doughnuts conceded (any set lost 0-6 or similar), and a "hardest games" score
// (that player's average opponent strength that month, scaled down by 300 -- the same tier-gap
// unit used everywhere else in the app -- into a friendlier small number).
// Skip filtering by date when 'all' is chosen, so the same summary format also works as a
// whole-season recap, not just a single month.
// `splitByTier` files each match under the tier the player was in ON THAT
// DATE, so a mid-month tier change produces two rows rather than moving a
// month's points into whichever tier they ended in. Off by default: every
// other caller wants one row per player for the whole month.
function computeMonthlySummaryStats(month, { splitByTier } = {}){
  const agg = {};
  const identity = {};   // aggregation key -> { name, tier, dates }
  function A(name, date){
    const tier = splitByTier ? historicalTierOf(name, date) : null;
    // A match whose tier cannot be established is still the player's match.
    // It is aggregated under them without a tier rather than dropped, and the
    // grouped view simply has no tier section to put it in.
    const key = splitByTier ? LeagueSplit.keyFor(name, tier || '') : name;
    if(!agg[key]){
      agg[key] = {wins:0, losses:0, draws:0, doughnuts:0, strengths:[], games_w:0, games_l:0, list:[]};
      identity[key] = { name, tier: splitByTier ? tier : null, dates: [] };
    }
    if(date) identity[key].dates.push(date);
    return agg[key];
  }

  // Rated (non-draw) matches: ALL_MATCHES carries the raw set scores; MATCHES (same index, same
  // order) carries the computed match_strength -- combine the two rather than assuming either
  // array alone has everything needed.
  ALL_MATCHES.forEach((raw, idx)=>{
    if(month !== 'all' && raw.date.slice(0,7) !== month) return;
    const enriched = MATCHES[idx];
    if(!enriched) return;
    const allNames = [...new Set([...raw.winners, ...raw.losers])];
    allNames.forEach(n => A(n, raw.date).strengths.push(enriched.match_strength));
    // Each count and the game it counts, in one step: whatever opens a row's
    // P, W, L or D reads this list, so it can only ever show what was counted.
    const game = (result) => ({ id: raw.id, date: raw.date, winners: raw.winners.slice(), losers: raw.losers.slice(), sets: raw.sets, isDraw: false, result });
    raw.winners.forEach(n=>{ const a = A(n, raw.date); a.wins++; a.games_w += enriched.games_winner; a.games_l += enriched.games_loser; a.list.push(game('W')); });
    raw.losers.forEach(n=>{ const a = A(n, raw.date); a.losses++; a.games_w += enriched.games_loser; a.games_l += enriched.games_winner; a.list.push(game('L')); });
    raw.sets.forEach(([x,y])=>{
      if(y === 0) raw.losers.forEach(n=>A(n, raw.date).doughnuts++);
      if(x === 0) raw.winners.forEach(n=>A(n, raw.date).doughnuts++);
    });
  });

  // Draws are excluded from the rating engine entirely, so they're pulled separately here --
  // "winners"/"losers" on a draw just mean team1/team2, not an actual result.
  getAllApprovedMatches().filter(m => m.isDraw && (month==='all' || m.date.slice(0,7)===month)).forEach(m=>{
    const allNames = [...new Set([...m.winners, ...m.losers])];
    const strengthEstimate = allNames.reduce((s,n)=>{
      const p = PLAYERS.find(x=>x.name===n);
      return s + (p ? p.rating : 1400);
    }, 0) / (allNames.length || 1);
    allNames.forEach(n => A(n, m.date).strengths.push(strengthEstimate));
    const team1Games = m.sets.reduce((s,[x,y])=>s+x,0);
    const team2Games = m.sets.reduce((s,[x,y])=>s+y,0);
    const drawn = { id: m.id, date: m.date, winners: m.winners.slice(), losers: m.losers.slice(), sets: m.sets, isDraw: true, result: 'D' };
    m.winners.forEach(n=>{ const a = A(n, m.date); a.draws++; a.games_w += team1Games; a.games_l += team2Games; a.list.push(drawn); });
    m.losers.forEach(n=>{ const a = A(n, m.date); a.draws++; a.games_w += team2Games; a.games_l += team1Games; a.list.push(drawn); });
    m.sets.forEach(([x,y])=>{
      if(y === 0) m.losers.forEach(n=>A(n, m.date).doughnuts++);
      if(x === 0) m.winners.forEach(n=>A(n, m.date).doughnuts++);
    });
  });

  const out = {};
  Object.keys(agg).forEach(key=>{
    const a = agg[key];
    const who = identity[key];
    const name = who.name;
    const games = a.wins + a.losses + a.draws;
    const avgStrength = a.strengths.length ? a.strengths.reduce((s,x)=>s+x,0)/a.strengths.length : 0;
    out[key] = {
      name, games, wins: a.wins, losses: a.losses, draws: a.draws,
      // Present only when splitting; the tier this stretch of the month was
      // played in, and the dates it covers.
      segmentTier: who.tier, segmentDates: who.dates.slice(),
      // The games behind P (and, by result, W / L / D).
      matchList: a.list.slice(),
      points: a.wins*3 + a.draws*1,
      winpct: games ? Math.round(1000*a.wins/games)/10 : 0,
      losspct: games ? Math.round(1000*a.losses/games)/10 : 0,
      gd: a.games_w - a.games_l,
      doughnuts: a.doughnuts,
      hardness: Math.round((avgStrength/300)*10)/10,
      avg_opp: Math.round(avgStrength),
    };
  });
  return out;
}

// Turns a metric into a ranked, tie-grouped top-N list: {rank, names:[...], value}. Ties share a
// rank and are grouped together (e.g. two players tied for 3rd both show as rank 3).
function topNTied(statsArr, key, n, descending){
  const sorted = statsArr.slice().sort((a,b)=> descending ? b[key]-a[key] : a[key]-b[key]);
  const groups = [];
  sorted.forEach(s=>{
    const last = groups[groups.length-1];
    if(last && last.value === s[key]){
      last.names.push(s.name);
    } else {
      groups.push({ value: s[key], names: [s.name] });
    }
  });
  return groups.slice(0, n).map((g,i)=>({ rank: i+1, names: g.names, value: g.value }));
}
const ZERO_MONTH_STATS = {wins:0,losses:0,total:0,winpct:0,avg_match_strength:0,avg_overperf_pct:0,game_diff:0,upset_wins:0,upset_losses:0,upset_total:0,upset_rate:0};

// `value` is required. It used to default to the Rankings month, which is how a
// select that forgot to say whose month it showed quietly displayed -- and
// then, via its change handler, overwrote -- somebody else's.
function populateMonthSelect(selectEl, value){
  if(!selectEl) return;
  if(value === undefined) throw new Error('populateMonthSelect: say whose month this is');
  const current = value;
  const months = getAvailableMonths();
  selectEl.innerHTML = `<option value="all">All time</option>` + months.map(m=>`<option value="${m}" ${m===current?'selected':''}>${monthLabel(m)}</option>`).join('');
  selectEl.value = current;
}

function applyTabVisibility(){
  document.querySelectorAll('#tabrow .tab-btn').forEach(btn=>{
    const tab = btn.dataset.tab;
    const visible = canSeeTab(tab);
    btn.style.display = visible ? '' : 'none';
    // if the active tab just got hidden, fall back to Win/Loss
    if(!visible && activeTab === tab){
      activeTab = 'wl';
      document.querySelectorAll('#tabrow .tab-btn').forEach(b=>b.classList.remove('active'));
      const wlBtn = document.querySelector('#tabrow .tab-btn[data-tab="wl"]');
      if(wlBtn) wlBtn.classList.add('active');
      ['calloutsView','playersView','findGameView','manageView','gamesView','h2hView','wishlistView','upcomingView'].forEach(id=>{
        const el = document.getElementById(id); if(el) el.style.display = 'none';
      });
      const listEl = document.getElementById('list'); if(listEl) listEl.style.display = 'block';
      ['tierbar','searchWrap','minGamesRow','monthFilterRow','sortbar'].forEach(id=>{
        const el = document.getElementById(id);
        if(el) el.style.display = (id==='searchWrap') ? 'block' : 'flex';
      });
      const sp = document.getElementById('sortbarPower'); if(sp) sp.style.display = 'none';
    }
  });
  // The shell draws its own navigation from the same rule.
  if(typeof onVisibilityChanged === 'function') onVisibilityChanged();
}

function rerenderCurrentTab(){
  if(activeTab==='wl' || activeTab==='power') render();
  else if(activeTab==='games') renderGamesTab();
  else if(activeTab==='callouts') renderCallouts();
}


const tierbar = document.getElementById('tierbar');
TIERS.forEach(t=>{
  const b = document.createElement('button');
  b.className = 'tierbtn' + (t==='All' ? ' active' : '');
  b.textContent = t === 'All' ? 'All tiers' : 'Tier ' + t;
  b.dataset.tier = t;
  b.onclick = ()=>{ activeTier = t; document.querySelectorAll('.tierbtn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); render(); };
  tierbar.appendChild(b);
});

document.querySelectorAll('#tabrow .tab-btn').forEach(b=>{
  b.onclick = ()=>{
    // Every route to a screen -- shell navigation, More, Home shortcuts, a
    // button on another screen -- arrives through here. A screen switched to
    // Admin only is not drawn for a player however they got here.
    if(!canSeeTab(b.dataset.tab)){
      const fb = document.querySelector(`#tabrow .tab-btn[data-tab="${visibleFallbackTab(b.dataset.tab)}"]`);
      if(fb && fb !== b) fb.click();
      return;
    }
    const arrivingFrom = activeTab;
    activeTab = b.dataset.tab;
    // Arrival is navigation, not redrawing. dataChanged() and every other
    // redraw go through renderActiveTab and never pass here, which is what
    // keeps a default from moving while somebody is reading it. Power and
    // Win/Loss are one Rankings screen with one month; moving between them is
    // not arriving.
    const rankingsTabs = ['power', 'wl'];
    if(rankingsTabs.includes(activeTab) && !rankingsTabs.includes(arrivingFrom)) arriveAtRankings();
    if(activeTab === 'summary' && arrivingFrom !== 'summary') arriveAtSummary();
    // Upcoming opens as a list to scan: every fixture folded, each one opened
    // on its own. Redraws after an action keep what the reader opened.
    if(activeTab === 'upcoming' && arrivingFrom !== 'upcoming') upcomingOpen = new Set();
    if(activeTab !== arrivingFrom){ fixtureManageOpen = null; fixtureManageMessage = ''; fixtureRemoveArmed = null; }
    document.querySelectorAll('#tabrow .tab-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');

    const isCallouts = activeTab === 'callouts';
    const isPlayers = activeTab === 'players';
    const isFindGame = activeTab === 'findgame';
    const isManage = activeTab === 'manage';
    const isGames = activeTab === 'games';
    const isH2H = activeTab === 'h2h';
    const isWishlist = activeTab === 'wishlist';
    const isUpcoming = activeTab === 'upcoming';
    const isSummary = activeTab === 'summary';
    const isListView = !isCallouts && !isPlayers && !isFindGame && !isManage && !isGames && !isH2H && !isWishlist && !isUpcoming && !isSummary;

    document.getElementById('tierbar').style.display = isListView ? 'flex' : 'none';
    document.getElementById('searchWrap').style.display = (isListView || isPlayers) ? 'block' : 'none';
    document.getElementById('minGamesRow').style.display = isListView ? 'flex' : 'none';
    document.getElementById('monthFilterRow').style.display = isListView ? 'flex' : 'none';
    document.getElementById('sortbar').style.display = (activeTab==='wl') ? 'flex' : 'none';
    document.getElementById('sortbarPower').style.display = (activeTab==='power') ? 'flex' : 'none';
    document.getElementById('list').style.display = isListView ? 'block' : 'none';
    document.getElementById('empty').style.display = 'none';
    document.getElementById('calloutsView').style.display = isCallouts ? 'block' : 'none';
    document.getElementById('playersView').style.display = isPlayers ? 'block' : 'none';
    document.getElementById('findGameView').style.display = isFindGame ? 'block' : 'none';
    document.getElementById('manageView').style.display = isManage ? 'block' : 'none';
    document.getElementById('gamesView').style.display = isGames ? 'block' : 'none';
    document.getElementById('h2hView').style.display = isH2H ? 'block' : 'none';
    document.getElementById('wishlistView').style.display = isWishlist ? 'block' : 'none';
    document.getElementById('upcomingView').style.display = isUpcoming ? 'block' : 'none';
    document.getElementById('summaryView').style.display = isSummary ? 'block' : 'none';

    const HEADER_SUB_BY_TAB = {
      wl: 'Parsed from the group chats, June–August 2026 · tap a player for their match log',
      power: 'A tier-anchored power rating · scoreline counts, not just who won · tap a player for details',
      callouts: 'Games worth setting up next, based on what the data can\'t yet confirm',
      findgame: 'Pick a player, a scope, and a difficulty — get a complete four-player match, ready to book',
      manage: 'Add results going forward and tag who\'s active — everything above recalculates instantly',
      games: 'Every game, newest first — pending ones need approval before they count',
      h2h: 'Pick two players and see their full history, as opponents and as teammates',
      wishlist: 'Propose a game — once all four players confirm, it moves to Upcoming',
      upcoming: 'Games everyone has confirmed they\'re in for',
      summary: 'A monthly awards recap, built from the same data as everywhere else — copy it straight into WhatsApp',
      players: 'Every player, A–Z · tap a name for their full profile',
    };
    document.getElementById('headerSub').textContent = HEADER_SUB_BY_TAB[activeTab] || HEADER_SUB_BY_TAB.players;

    const EXPLAINER_BY_TAB = {
      wl: 'Built from readable trophy-emoji results across the main group chat and Results Only, with names and tiers confirmed against the group. Excludes single-set/"money game" results, matches against non-members, and a couple of results with no opponent named or a disputed winner.',
      power: 'Ratings start from the tier each player is already known to sit in (S highest, C lowest) — the tiers are treated as real signal, not something the model has to rediscover from scratch. From there, results move you based on <b>games won within each match</b>, not just who won — a close 3-set loss barely costs anything, a 6-1 6-2 loss costs a lot. A player with few games stays close to their tier baseline since there isn\'t much evidence yet to move them; a player with a long track record can drift further from it. "Avg opp." is the average strength of everyone you\'ve played with and against. "Clutch %" compares your actual scorelines to what your tier and opponents would predict. "Upset wins/losses" count matches where the underdog won outright (or the favorite lost outright) by a meaningful ratings gap — a fast way to spot giant-killers and upset-prone favorites. Use the min-games filter below to hide anyone with too few games for these numbers to mean much. "Recent Form" sorts by wins over the last 10 games first, then by average overperformance as a tiebreaker — a faster-moving signal than the overall rating, useful for spotting who\'s trending right now.',
      callouts: 'Suggested matchups are full 2v2s — a wingman is added to each side, chosen to keep team strength balanced, so these are games you could actually go and organize. This spans every tier, not just the ones with the least data — S/A near-ties get surfaced the same way as small-sample C-tier players. Every player also has their own Easy / Balanced / Hard opponent suggestions on their profile page. The Data filter above changes which matches feed these ratings — defaults to June onwards only.',
      findgame: '"Within my tier" keeps every suggested player inside your own tier — easy always means the weakest pair actually in your tier, hard the strongest, never a reach into a different tier. "Any tier" opens it up and targets a rating roughly 150 points below/above your own. Every recommendation is a full four-player match: the ranked opponent pair, plus the partner who\'d make it an even match (a proven-chemistry partner is used automatically when one is just as close). Matchups are chosen from current Power Ratings; the predicted share of games behind them is shown to admins only. Alternatives are only labeled Fresh Matchup, Proven Chemistry or Tougher Test when the data actually supports that read — "See all recommendations" has the full ranked list underneath. This is computed live, not a fixed list, so try different scopes and difficulties freely. Players who\'ve gone inactive are excluded from every suggestion here, though their history stays visible elsewhere.',
      manage: 'This data is shared — anyone who opens this artifact sees the same games and tags. Ratings, tiers, and every suggestion above recompute from scratch the moment you add a game or change a tag.',
      games: 'Editing or deleting a game recalculates every rating instantly. Every change is recorded against whoever the app currently has you signed in as — the player shown in the header, which you can change from the Add a game panel.',
      h2h: 'Opponent record only counts matches where the two were on opposite teams; teammate record only counts matches where they played together.',
      wishlist: 'Anyone can propose a game. Each of the four named players confirms it themselves from their own player profile — once all four are in, it moves to the Upcoming tab automatically.',
      upcoming: 'A game arrives here either by all four players confirming a request, or by an admin agreeing it directly — from Requests, or straight off a prediction. Date, time and venue can stay TBC until they are known. Once it has been played, "Add result" carries the same players into the Games form so nobody types them twice, and submitting the result clears it from here: there is one record of the game, in Games, not two.',
      summary: 'Points: 3 for a win, 1 for a draw. "Hardest games" is average opponent strength that month, scaled down by 300 for a friendlier number. "Doughnuts" are sets lost 0-6 or similar. Player of the Month is whoever tops the points table.',
      players: '',
    };
    document.getElementById('explainer').innerHTML = EXPLAINER_BY_TAB[activeTab] || '';
    // The League view hides this wrapper (it duplicates that screen's own
    // explanation); every other tab gets it back.
    const explainerWrap = document.getElementById('explainerWrapper');
    if(explainerWrap) explainerWrap.style.display = '';

    renderActiveTab();
  };
});

// Re-render whichever tab is currently on screen. Power Rankings and Win/Loss
// share render(); everything else has its own render function.
//
// Arriving at Admin/Manage collapses every section. That is on ENTERING the
// screen, not on every render: renderManage() runs again on each toggle, each
// staged decision and each saved setting, and resetting there would slam a
// section shut the moment it was opened.
let lastRenderedTab = null;

// ===================== WAITING FOR THE RECORD =====================
// False until init() has the whole record. Nothing may draw a screen before
// then.
//
// This is the difference between a slow screen and a permanently empty one.
// Every renderer below reads PLAYERS, ALL_MATCHES and the v3 state; run before
// those exist, they produce an empty screen and nothing ever runs them again,
// because start-up's last act redraws only the rankings list. A reader who
// tapped Players, League, Call-Outs or Head-to-Head during the second or two
// the record takes to arrive got a screen that stayed blank until they
// navigated away and came back. Measured, reproduced, and the reason this flag
// exists: a screen is either drawn from the record or it says it is waiting
// for it, and start-up draws whichever screen is in front of the reader the
// moment the record lands.
let DATA_READY = false;

// Start-up has two halves, and they no longer finish in a predictable order.
//
// The record used to take fourteen round trips, so shell.js -- parsed straight
// after app.js, and building the navigation shell, the Home dashboard and the
// wrapped render() on DOMContentLoaded -- was always ready long first, and
// init() could simply draw at the end of itself. Reading everything at once
// removed that accident: against a fast database init() can now reach its last
// line before shell.js has been parsed at all, and the screen it wants to draw
// is built in there.
//
// So neither half draws the first screen. Whichever of them finishes second
// does, exactly once.
let SHELL_READY = false;
let firstScreenDrawn = false;

function drawFirstScreen(){
  if(firstScreenDrawn || !DATA_READY || !SHELL_READY) return;
  firstScreenDrawn = true;
  clearBootNotice();
  // render() draws #list, which serves Power Rating and Win/Loss and nothing
  // else -- and it also triggers the shell's one-time first-render set-up (the
  // podium, the viewer, the Home dashboard) that the rest of the app assumes
  // has happened. So it always runs.
  PerfTrace.time('render #list', render);
  // And then whatever screen is actually in front of the reader. Start-up used
  // to end at the line above, so anyone who tapped Players, League, Call-Outs
  // or Head-to-Head while the record was still arriving got that screen drawn
  // once, from nothing, and never drawn again: blank until they navigated away
  // and back. See renderActiveTab, which now declines to draw a screen at all
  // before there is anything to draw it from.
  if(activeTab !== 'power' && activeTab !== 'wl') renderActiveTab();
  renderHomeDashboard(); // no-ops until the dashboard exists
  PerfTrace.mark('screen drawn');
  if(PerfTrace.enabled) PerfTrace.report();
}

// Which element each tab owns. Only used while waiting -- the renderers
// themselves know their own containers.
const TAB_VIEW_ID = {
  power: 'list', wl: 'list', summary: 'summaryView', players: 'playersView',
  games: 'gamesView', h2h: 'h2hView', callouts: 'calloutsView',
  wishlist: 'wishlistView', upcoming: 'upcomingView', manage: 'manageView',
  findgame: 'findGameView',
};

function bootNoticeEl(){ return document.getElementById('bootNotice'); }

function showBootNotice(){
  if(bootNoticeEl() || !document.body) return;
  const el = document.createElement('div');
  el.id = 'bootNotice';
  el.className = 'boot-notice';
  el.textContent = 'Loading the club record…';
  document.body.appendChild(el);
  showBootPlaceholder();
}

function clearBootNotice(){
  const el = bootNoticeEl();
  if(el) el.remove();
  // Any screen the reader landed on while waiting is about to be drawn
  // properly; a screen they merely passed through would otherwise keep the
  // placeholder until something redrew it.
  document.querySelectorAll('.boot-placeholder').forEach(x => x.remove());
}

// A deliberately non-blocking wait. The reader may still choose a screen
// while the record is arriving -- that choice is honoured, and that screen is
// the one drawn when it lands.
function showBootPlaceholder(){
  const id = TAB_VIEW_ID[activeTab];
  const box = id && document.getElementById(id);
  // Only where the screen would otherwise be empty. Find a Game and Manage
  // carry markup written into index.html, and replacing it would destroy the
  // form the reader is looking at.
  if(!box || box.firstElementChild) return;
  const ph = document.createElement('div');
  ph.className = 'boot-placeholder';
  ph.textContent = 'Loading…';
  box.appendChild(ph);
}

function renderActiveTab(){
  // Before the record exists there is nothing to draw and no honest way to
  // draw it. Start-up calls this again the moment there is.
  if(!DATA_READY){ showBootPlaceholder(); return; }
  if(activeTab === 'manage' && lastRenderedTab !== 'manage') resetAdminSections();
  lastRenderedTab = activeTab;
  PerfTrace.time('draw ' + activeTab, ()=>{
    if(activeTab === 'callouts') renderCallouts();
    else if(activeTab === 'players') renderPlayersTab();
    else if(activeTab === 'findgame') renderFindGame();
    else if(activeTab === 'manage') renderManage();
    else if(activeTab === 'games') renderGamesTab();
    else if(activeTab === 'h2h') renderH2H();
    else if(activeTab === 'wishlist') renderWishlist();
    else if(activeTab === 'upcoming') renderUpcoming();
    else if(activeTab === 'summary') renderSummary();
    else render();
  });
}

// ===================== ONE MUTATION, ONE REFRESH =====================
// Everything that changes the record ends here.
//
// It used to end wherever the author of that particular button happened to
// stop: approving a game redrew the Games tab, a tier override redrew the
// admin list, submitting a result redrew nothing at all. Derived state was
// rebuilt correctly every time -- `recomputeAll()` was never the problem --
// but the screen in front of the reader was only redrawn if the mutation
// happened to live on it. Removing one rated match from the record moved four
// players' ratings and changed nothing visible on the League Table, the Merit
// Table, the Players Directory, Call-Outs, Head-to-Head or the Wishlist. They
// stayed wrong until the reader navigated away and back, which is exactly the
// kind of wrongness nobody reports as a bug because it looks like a number
// they misread.
//
// So the rule is now one line long: if the record changed, the screen in front
// of the reader is redrawn from it.
//
// `redraw` names the exception rather than allowing one. Two controls are
// operated in a rapid sequence -- the tier and starting-tier dropdowns in the
// admin player list -- and redrawing the whole of Admin under the reader's
// finger would take the focus off the select they are still using. They pass
// the narrower redraw they want. Nothing may pass "none": a mutation that
// redraws nothing is the defect this function exists to make impossible.
function dataChanged(opts){
  recomputeAll();
  // Built from the journey, which a correction, an approval or an adjustment
  // all rewrite. Keyed by date, so a stale one survives until the same date is
  // reviewed again -- it was cleared by the review commit alone, and by
  // nothing else that changes what it was built from.
  reviewSnapshotCache = null;
  ((opts && opts.redraw) || renderActiveTab)();
  renderHomeDashboard(); // no-ops until the Home dashboard exists
}

document.querySelectorAll('#sortbar .sortbtn').forEach(b=>{
  b.onclick = ()=>{ activeSort = b.dataset.sort; document.querySelectorAll('#sortbar .sortbtn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); render(); };
});
document.querySelectorAll('#sortbarPower .sortbtn').forEach(b=>{
  b.onclick = ()=>{ activeSortP = b.dataset.sortp; document.querySelectorAll('#sortbarPower .sortbtn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); render(); };
});

document.getElementById('search').addEventListener('input', e=>{
  query = e.target.value.trim().toLowerCase();
  if(activeTab === 'players') renderPlayersTab(); else render();
});

const minGamesInput = document.getElementById('minGamesInput');
// Scoped to #minGamesRow. `.preset-btn` is a shared button style used by the
// state filters and half the Admin screen too, so an unscoped selector here
// would clear their selected state and, worse, feed parseInt(undefined) into
// minGames the moment somebody pressed one.
const MIN_GAMES_BTNS = '#minGamesRow .preset-btn';
function setMinGames(n){
  minGames = n;
  minGamesInput.value = n;
  document.querySelectorAll(MIN_GAMES_BTNS).forEach(b=> b.classList.toggle('active', parseInt(b.dataset.n)===n));
}
minGamesInput.addEventListener('input', e=>{
  minGames = Math.max(0, parseInt(e.target.value) || 0);
  document.querySelectorAll(MIN_GAMES_BTNS).forEach(b=> b.classList.toggle('active', parseInt(b.dataset.n)===minGames));
  render();
});
document.querySelectorAll(MIN_GAMES_BTNS).forEach(b=>{
  b.onclick = ()=>{
    minGames = parseInt(b.dataset.n);
    minGamesInput.value = minGames;
    document.querySelectorAll(MIN_GAMES_BTNS).forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    render();
  };
});

// Two independent toggles, not a mutually exclusive pair.
document.querySelectorAll('#stateFilterRow .state-toggle').forEach(b=>{
  b.onclick = ()=>{
    if(b.dataset.toggle === 'idle') includeIdle = !includeIdle;
    else includeInactive = !includeInactive;
    b.classList.toggle('active', b.dataset.toggle === 'idle' ? includeIdle : includeInactive);
    render();
  };
});

const monthSelect = document.getElementById('monthSelect');
monthSelect.addEventListener('change', e=>{
  // A choice, recorded as one. From here on this reader's Rankings month is
  // theirs for the session, and no default re-evaluation touches it.
  rankingsMonthChoice = e.target.value;
  applyRankingsMonth(e.target.value);
  rerenderCurrentTab();
});

// The single entry point for changing the app-wide Data Range. Everything
// downstream is rebuilt from the newly-filtered match list, so no screen can
// be left showing figures from the other dataset.
function applyDataRangeChange(value){
  const previous = dataRange;
  setDataRange(value);
  if(dataRange === previous) return false;
  recomputeAll();
  // Narrowing the range can strand the selected month (see
  // reconcileSelectedMonth) -- fix it before anything re-reads it.
  reconcileSelectedMonth();
  populateMonthSelect(document.getElementById('monthSelect'), selectedMonth);
  syncFullHistoryIndicator();
  renderActiveTab();
  renderHomeDashboard(); // no-ops if Home isn't built yet
  return true;
}


function sortRows(rows){
  const arr = [...rows];
  if(activeTab==='wl'){
    if(activeSort==='winpct') arr.sort((a,b)=> b.winpct - a.winpct || b.total - a.total);
    else if(activeSort==='total') arr.sort((a,b)=> b.total - a.total);
    else if(activeSort==='wins') arr.sort((a,b)=> b.wins - a.wins);
    else if(activeSort==='name') arr.sort((a,b)=> a.name.localeCompare(b.name));
  } else {
    // "Rating" always represents the ranking basis for whatever scope is currently selected --
    // season-long normally, or that month's own rating when a month is selected, so it matches
    // whichever number is actually shown as the big rating figure on each row.
    if(activeSortP==='rating') arr.sort((a,b)=>{
      const av = selectedMonth !== 'all' ? (a.month_rating ?? -Infinity) : a.rating;
      const bv = selectedMonth !== 'all' ? (b.month_rating ?? -Infinity) : b.rating;
      return bv - av;
    });
    else if(activeSortP==='month_rating') arr.sort((a,b)=> (b.month_rating ?? -Infinity) - (a.month_rating ?? -Infinity));
    else if(activeSortP==='recent_form') arr.sort((a,b)=> {
      // Stale form (no game in a while) shouldn't outrank someone who's actually active right now.
      if(a.recent_form_stale !== b.recent_form_stale) return a.recent_form_stale ? 1 : -1;
      return (b.recent_form_wins ?? -999) - (a.recent_form_wins ?? -999) || (b.recent_form ?? -999) - (a.recent_form ?? -999);
    });
    else if(activeSortP==='avg_match_strength') arr.sort((a,b)=> b.avg_match_strength - a.avg_match_strength);
    else if(activeSortP==='avg_overperf_pct') arr.sort((a,b)=> b.avg_overperf_pct - a.avg_overperf_pct);
    else if(activeSortP==='upset_total') arr.sort((a,b)=> b.upset_rate - a.upset_rate || b.upset_total - a.upset_total);
    else if(activeSortP==='name') arr.sort((a,b)=> a.name.localeCompare(b.name));
  }
  return arr;
}

function renderRankingsMonthNote(){
  const host = document.getElementById('rankingsMonthNoteHost');
  if(!host) return;
  host.innerHTML = rankingsMonthChoice === null
    ? meaningfulMonthNoteHtml(rankingsMonthDefault, selectedMonth, 'rankingsMonth')
    : '';
  wireMeaningfulMonthNote('rankingsMonth', (month)=>{
    rankingsMonthChoice = month;
    applyRankingsMonth(month);
    rerenderCurrentTab();
  });
}

function render(){
  // A sort button, a min-games preset or the search box can all be pressed
  // while the record is still arriving. Drawing an empty rankings list and an
  // "empty" message in answer is worse than saying nothing: it reads as a
  // finished screen with no players in the club.
  if(!DATA_READY){ showBootPlaceholder(); return; }
  renderRankingsMonthNote();
  const monthRatingBtn = document.getElementById('sortMonthRatingBtn');
  if(monthRatingBtn){
    const showIt = selectedMonth !== 'all';
    monthRatingBtn.style.display = showIt ? '' : 'none';
    if(!showIt && activeSortP === 'month_rating'){
      // The month filter was cleared while sorted by it -- fall back to the season rating.
      activeSortP = 'rating';
      document.querySelectorAll('#sortbarPower .sortbtn').forEach(b=> b.classList.toggle('active', b.dataset.sortp==='rating'));
    }
  }

  let rows = PLAYERS.filter(matchesActiveTier);
  let monthlyRatings = {};
  if(selectedMonth !== 'all'){
    const monthly = computeMonthlyStats(selectedMonth);
    monthlyRatings = monthEndRatings(selectedMonth);
    const movement = monthlyMovementIndex(selectedMonth);
    rows = rows.map(p => {
      const mv = movement[p.name] || null;
      return {...p, ...(monthly[p.name] || ZERO_MONTH_STATS),
        month_rating: (p.name in monthlyRatings) ? Math.round(monthlyRatings[p.name]*10)/10 : null,
        // The three monthly stories, kept as distinct fields so no screen can
        // quietly present one as another.
        month_rating_change: mv ? mv.ratingChange : null,
        month_rank_change: mv ? mv.rankChangeOverall : null,
        month_rank_change_tier: mv ? mv.rankChangeInTier : null,
        month_performance_pct: mv ? mv.performancePct : null,
        month_performance_provisional: mv ? mv.provisional : true};
    });
  }
  rows = rows.filter(p => p.total >= minGames);
  // The visible pool. Ranked and Active always; the other two only when asked
  // for, and then as full members of the same ordered list.
  rows = rows.filter(p => {
    const st = playerStateOf(p.name);
    if(!st) return true;
    if(st.participation === 'INACTIVE') return includeInactive;
    return st.ranking === 'RANKED' || includeIdle;
  });
  if(query) rows = rows.filter(p => p.name.toLowerCase().includes(query));
  rows = sortRows(rows);

  const list = document.getElementById('list');
  const empty = document.getElementById('empty');
  list.innerHTML = '';
  empty.style.display = rows.length ? 'none' : 'block';

  if(selectedMonth !== 'all'){
    const noteWrapper = document.createElement('div');
    const noteToggle = document.createElement('button');
    noteToggle.className = 'month-note-toggle';
    noteToggle.textContent = `${monthLabel(selectedMonth)} ranking methodology  ⓘ`;
    const note = document.createElement('div');
    note.className = 'section-sub';
    note.style.cssText = 'padding:8px 2px; display:none;';
    note.innerHTML = activeTab==='power'
      ? `Showing <b style="color:var(--text);">${monthLabel(selectedMonth)}</b> only — record, avg opp., clutch and upsets are for this month. The big number is your <b style="color:var(--text);">real Power Rating as it stood at the end of ${monthLabel(selectedMonth)}</b>, not a separate monthly score: there is one continuous rating and this is where it had reached. Underneath it, the points figure is how far it moved during the month, and the arrow is rank movement. <b style="color:var(--text);">Performance</b> is a different question again — how far above or below pre-match expectation you played.`
      : `Showing <b style="color:var(--text);">${monthLabel(selectedMonth)}</b> only.`;
    noteToggle.onclick = ()=>{
      const isOpen = note.style.display !== 'none';
      note.style.display = isOpen ? 'none' : 'block';
      noteToggle.classList.toggle('open', !isOpen);
    };
    noteWrapper.appendChild(noteToggle);
    noteWrapper.appendChild(note);
    list.appendChild(noteWrapper);

    if(activeTab==='power'){
      const stories = buildMonthlyStoriesHtml(selectedMonth);
      if(stories){
        const wrap = document.createElement('div');
        wrap.innerHTML = stories;
        list.appendChild(wrap);
        const msToggle = wrap.querySelector('#monthlySummaryToggle');
        if(msToggle) msToggle.onclick = ()=>{ monthlySummaryOpen = !monthlySummaryOpen; render(); };
      }
    }
  }

  rows.forEach((p, i)=>{
    const row = document.createElement('div');
    row.className = 'row';
    row.onclick = ()=>{
      if(activeTab==='power' && selectedMonth!=='all' && p.month_rating!==null && p.month_rating!==undefined && typeof openMonthlyRatingBreakdown==='function'){
        openMonthlyRatingBreakdown(p.name, selectedMonth);
      } else {
        openSheet(p.name);
      }
    };
    if(activeTab==='wl'){
      row.innerHTML = `
        <div class="rank">${i+1}</div>
        <div class="badge ${p.tier}">${p.tier}</div>
        <div class="namecol">
          <div class="nm">${p.name}</div>
          <div class="meta">${p.total} game${p.total===1?'':'s'} played</div>
        </div>
        <div class="wl">
          <div class="pct">${p.winpct}%</div>
          <div class="rec"><span class="w">${p.wins}W</span> · <span class="l">${p.losses}L</span></div>
        </div>
      `;
    } else {
      const perfClass = p.avg_overperf_pct > 0.5 ? 'perf-pos' : (p.avg_overperf_pct < -0.5 ? 'perf-neg' : '');
      const perfSign = p.avg_overperf_pct > 0 ? '+' : '';

      const inMonthView = selectedMonth !== 'all';
      const hasMonthGames = inMonthView && p.month_rating !== null && p.month_rating !== undefined;
      const bigNumberHtml = (inMonthView && hasMonthGames)
        ? `<div class="rating-big">${Math.round(p.month_rating)}</div>`
        : (inMonthView
            ? `<div class="rating-big" style="color:var(--text-dim); font-size:20px;">–</div>`
            : `<div class="rating-big">${Math.round(p.rating)}</div>`);
      const chg = p.month_rating_change;
      const moveHtml = (inMonthView && hasMonthGames && chg !== null)
        ? `<div class="rating-sub" style="font-size:10px;"><span class="${chg>0?'perf-pos':(chg<0?'perf-neg':'')}">${chg>0?'+':''}${chg} pts</span>${rankArrowHtml(p.month_rank_change)}</div>`
        : '';
      const seasonSubHtml = inMonthView
        ? moveHtml + `<div class="rating-sub" style="font-size:10px; color:var(--text-dim);">overall: ${Math.round(p.rating)}</div>`
        : '';
      const monthRatingHtml = (inMonthView && !hasMonthGames)
        ? `<div class="rating-sub" style="font-size:10px; color:var(--text-dim);">no games this month</div>`
        : '';
      const wlHtml = inMonthView ? ` · <span style="color:var(--green);">${p.wins}W</span>-<span style="color:var(--red);">${p.losses}L</span>` : '';

      // Progressive disclosure: the row's one secondary "meta" line shows whichever stat the
      // current sort is actually about -- everything else stays reachable by tapping into the
      // full profile, rather than all appearing on the row at once.
      let metaHtml;
      if(activeSortP === 'avg_match_strength'){
        metaHtml = `avg opp. ${Math.round(p.avg_match_strength)}${wlHtml}`;
      } else if(activeSortP === 'upset_total'){
        metaHtml = `<span class="upset-drill" data-player="${p.name}" data-kind="upset_wins">${p.upset_wins} upset win${p.upset_wins===1?'':'s'}</span> · <span class="upset-drill" data-player="${p.name}" data-kind="upset_losses">${p.upset_losses} upset loss${p.upset_losses===1?'':'es'}</span>`;
      } else {
        metaHtml = `${p.total} game${p.total===1?'':'s'}${wlHtml}`;
      }

      // Form: one compact line (record + a trend glyph) instead of a full sentence; a stale
      // player gets a quiet dot rather than an explanatory paragraph on every row.
      let formLine = '';
      if(p.recent_form !== null && p.recent_form !== undefined){
        if(p.recent_form_stale){
          formLine = `<div class="rating-sub" style="font-size:10px; color:var(--text-dim); opacity:0.6;">Form ${p.recent_form_wins}W-${p.recent_form_losses}L <span title="stale -- last played ${fmtDaysAgo(p.recent_form_days_ago)}">·</span></div>`;
        } else {
          const trend = p.recent_form > 3 ? '↑' : (p.recent_form < -3 ? '↓' : '→');
          const trendClass = p.recent_form > 3 ? 'perf-pos' : (p.recent_form < -3 ? 'perf-neg' : '');
          formLine = `<div class="rating-sub" style="font-size:10px;">Form ${p.recent_form_wins}W-${p.recent_form_losses}L <span class="${trendClass}">${trend}</span></div>`;
        }
      }

      // The badge has to describe the SAME moment as the number beside it.
      // It used to render today's tier against the selected month's closing
      // rating, so a player promoted in September was shown as a Tier A player
      // holding the rating they had while they were a B -- which is the
      // complaint, in its general form. `tierInScope` is the month-aware
      // answer the tier filter already uses; falling back to the current tier
      // only where a month has no row for them.
      const rowTier = tierInScope(p) || p.tier;

      row.innerHTML = `
        <div class="rank">${i+1}</div>
        <span class="tier-badge tier-${rowTier.toLowerCase()}">${rowTier}</span>
        <div class="namecol">
          <div class="nm">${p.name}</div>
          <div class="meta">${metaHtml}</div>
        </div>
        <div class="wl">
          ${bigNumberHtml}
          <div class="rating-sub ${perfClass}">${perfSign}${p.avg_overperf_pct}%</div>
          ${formLine}
          ${seasonSubHtml}
          ${monthRatingHtml}
        </div>
      `;
    }
    list.appendChild(row);
    row.querySelectorAll('.upset-drill').forEach(el=>{
      el.onclick = (e)=>{
        e.stopPropagation();
        openSheet(el.dataset.player, el.dataset.kind);
      };
    });
  });
}

function ratingOf(n){ const x = PLAYERS.find(pl=>pl.name===n); return x ? Math.round(x.rating) : null; }

const RISK_LABELS = {
  promotion_watch: {text: "Promotion watch", cls: "risk-promotion"},
  demotion_watch: {text: "Demotion watch", cls: "risk-demotion"},
  unproven: {text: "Unproven — small sample", cls: "risk-unproven"},
  stable: {text: "Stable", cls: "risk-stable"},
};

function computeRecentForm(name, windowSize){
  windowSize = windowSize || 10;
  const own = MATCHES.filter(m => m.winners.includes(name) || m.losers.includes(name))
    .sort((a,b)=> a.date < b.date ? 1 : -1) // newest first
    .slice(0, windowSize);
  if(own.length === 0) return null;
  const vals = own.map(m=>{
    const won = m.winners.includes(name);
    return won ? m.performance_residual : -m.performance_residual;
  });
  const avg = vals.reduce((s,x)=>s+x,0) / vals.length;
  const wins = own.filter(m=>m.winners.includes(name)).length;
  const losses = own.length - wins;
  const lastGameDate = own[0].date; // own is sorted newest-first
  const daysSinceLastGame = Math.floor((new Date() - new Date(lastGameDate)) / 86400000);
  return { avgPct: Math.round(avg*1000)/10, games: own.length, wins, losses, lastGameDate, daysSinceLastGame };
}

// A player who hasn't played in a while shouldn't read as "trending" just because their last
// batch of games happened to go well -- this is the cutoff for treating Recent Form as stale.
const RECENT_FORM_STALE_DAYS = 14;
function fmtDaysAgo(days){
  if(days === 0) return 'today';
  if(days === 1) return '1 day ago';
  if(days < 14) return days + ' days ago';
  const weeks = Math.round(days/7);
  if(weeks < 8) return weeks + (weeks===1?' week ago':' weeks ago');
  const months = Math.round(days/30);
  return months + (months===1?' month ago':' months ago');
}

function buildProfileText(p){
  const parts = [];

  // confidence / sample size
  if(p.confidence === 'low'){
    parts.push(`Only ${p.total} game${p.total===1?'':'s'} played so far — this rating leans heavily on the Tier ${p.tier} baseline rather than on much personal evidence, so it's the least certain kind of number in this dataset.`);
  } else if(p.confidence === 'medium'){
    parts.push(`${p.total} games played — enough to start moving away from the Tier ${p.tier} baseline, but still a fairly thin sample.`);
  } else {
    parts.push(`${p.total} games played — a solid track record, so this rating is largely earned rather than assumed from the tier.`);
  }

  // position within tier -- the one Tier Rank, not a count of everyone in it
  const tr = tierRankOf(p.name);
  const rankText = tr && tr.rank ? `Ranked #${tr.rank} of ${tr.of} in Tier ${p.tier}` : `Not currently ranked in Tier ${p.tier}`;
  if(Math.abs(p.rating_vs_tier_avg) < 15){
    parts.push(`${rankText}, right around the tier average (${Math.round(p.tier_avg_rating)}).`);
  } else if(p.rating_vs_tier_avg > 0){
    parts.push(`${rankText}, ${Math.round(p.rating_vs_tier_avg)} points above the tier average (${Math.round(p.tier_avg_rating)}).`);
  } else {
    parts.push(`${rankText}, ${Math.round(Math.abs(p.rating_vs_tier_avg))} points below the tier average (${Math.round(p.tier_avg_rating)}).`);
  }

  // schedule strength
  if(Math.abs(p.opp_vs_tier_avg) < 20){
    parts.push(`Opposition faced has been about average for the tier.`);
  } else if(p.opp_vs_tier_avg > 0){
    parts.push(`Opposition faced has run tougher than the tier average by ${Math.round(p.opp_vs_tier_avg)} points — a harder schedule than most tier-mates.`);
  } else {
    parts.push(`Opposition faced has run softer than the tier average by ${Math.round(Math.abs(p.opp_vs_tier_avg))} points — an easier schedule than most tier-mates.`);
  }

  // clutch
  if(p.avg_overperf_pct > 3){
    parts.push(`Scorelines have run ahead of what the ratings predicted (+${p.avg_overperf_pct}% clutch) — results have generally been better than expected.`);
  } else if(p.avg_overperf_pct < -3){
    parts.push(`Scorelines have run behind what the ratings predicted (${p.avg_overperf_pct}% clutch) — results have generally been a bit worse than expected.`);
  } else {
    parts.push(`Scorelines have tracked expectation closely (${p.avg_overperf_pct>=0?'+':''}${p.avg_overperf_pct}% clutch) — nothing unusual going on there.`);
  }

  // upsets
  if(p.upset_wins > 0 || p.upset_losses > 0){
    parts.push(`${p.upset_wins} upset win${p.upset_wins===1?'':'s'} and ${p.upset_losses} upset loss${p.upset_losses===1?'':'es'} on record.`);
  }

  // risk verdict
  if(p.risk === 'promotion_watch'){
    parts.push(`<b>Sits within ${Math.round(p.promotion_gap)} points of the tier above's floor</b> — a decent run would make a real case for promotion.`);
  } else if(p.risk === 'demotion_watch'){
    parts.push(`<b>Sits within ${Math.round(p.demotion_gap)} points of the tier below's ceiling</b> — worth keeping an eye on, though not a clear-cut case yet.`);
  } else if(p.risk === 'unproven'){
    parts.push(`Too little data to say anything definitive about tier placement either way.`);
  } else {
    parts.push(`Comfortably clear of both tier boundaries — no case for moving either way right now.`);
  }

  // best partnership
  const bp = BEST_PARTNER[p.name];
  if(bp){
    const smallSample = bp.games < 3 ? ' (small sample)' : '';
    parts.push(`Best chemistry so far has been with <b>${bp.partner}</b> — ${bp.wins}-${bp.losses} together (${bp.winpct}%), ${bp.avg_overperf>=0?'+':''}${bp.avg_overperf}% ahead of what the matchups alone predicted${smallSample}.`);
  }

  return parts.join(' ');
}

function renderCallouts(){
  const box = document.getElementById('calloutsView');
  let html = '';

  if(canSee('chemistry')){
    html += `<div class="section-heading">🤝 Best chemistry partnerships</div>`;
    html += `<div class="section-sub">Ranked by how much a pairing overperforms what the matchup alone would predict, not just their win rate — this is what "they barely lose together" actually looks like in the numbers. Minimum 2 games together; small samples are flagged.</div>`;
    const topPartnerships = PARTNERSHIPS.filter(p=>p.games>=2).sort((a,b)=> b.avg_overperf - a.avg_overperf).slice(0,8);
    topPartnerships.forEach(p=>{
      const perfClass = p.avg_overperf > 3 ? 'perf-pos' : (p.avg_overperf < -3 ? 'perf-neg' : '');
      const smallSample = p.games < 3 ? ` <span style="color:var(--text-dim); font-size:10px;">(small sample)</span>` : '';
      html += `<div class="callout-card">
        <div class="cc-title">${p.pair[0]} (Tier ${p.tier_a}) &amp; ${p.pair[1]} (Tier ${p.tier_b})${smallSample}</div>
        <div class="cc-detail">${p.games} games together · ${p.wins}-${p.losses} (${p.winpct}%) · <span class="${perfClass}">${p.avg_overperf>=0?'+':''}${p.avg_overperf}% chemistry</span></div>
      </div>`;
    });
  }

  html += `<div class="section-heading">🏆 Within-tier rank clarifiers</div>`;
  html += `<div class="section-sub">Near-ties inside the same tier, from S down to C — a mix of unsettled fresh matchups and razor-thin margins even after plenty of meetings, since both are worth knowing about.</div>`;
  const tierOrderDisplay = ["S","A","B","C"];
  tierOrderDisplay.forEach(t=>{
    const games = WITHIN_TIER_GAMES.filter(c=>c.tier===t);
    if(games.length === 0) return;
    html += `<div style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:11.5px; color:var(--gold-soft); font-weight:700; margin:8px 0 4px;">TIER ${t}</div>`;
    games.forEach(c=>{
      const m = c.matchup;
      let wingNote = '';
      if(!m.pure_tier){
        wingNote = `<br/><span style="color:var(--text-dim); font-size:10.5px;">wingmen pulled partly from Tier ${m.tiers_involved.filter(x=>x!==t).join(', ')} — no other Tier ${t} player available to fill both sides</span>`;
      } else if(m.has_light_wingman){
        wingNote = `<br/><span style="color:var(--text-dim); font-size:10.5px;">stays all Tier ${t} — one wingman has fewer than 4 games, so treat the balance as a bit more provisional</span>`;
      }
      html += `<div class="callout-card">
        <div class="cc-title">${c.a} (${Math.round(c.rating_a)}, ${c.games_a}g) vs ${c.b} (${Math.round(c.rating_b)}, ${c.games_b}g)</div>
        <div class="cc-detail">Just ${c.gap} rating points apart · played each other ${c.played_before}x so far</div>
        <div class="matchup-vs"><b>${m.team1[0]} &amp; ${m.team1[1]}</b> (${Math.round(m.team1_rating)}) &nbsp;vs&nbsp; <b>${m.team2[0]} &amp; ${m.team2[1]}</b> (${Math.round(m.team2_rating)})<br/><span style="color:var(--text-dim); font-size:11px;">teams balanced within ${m.team_gap} pts</span>${wingNote}</div>
      </div>`;
    });
  });

  html += `<div class="section-heading">🎯 Boundary tests</div>`;
  html += `<div class="section-sub">Close ratings straddling a tier line — these games carry the most weight for deciding if the line is in the right place. A wingman is added to each side to keep the two teams balanced.</div>`;
  if(BOUNDARY_TESTS.length === 0){
    html += `<div class="section-sub">No close cross-tier pairings with enough of a track record yet.</div>`;
  } else {
    BOUNDARY_TESTS.forEach(c=>{
      const m = c.matchup;
      html += `<div class="callout-card">
        <div class="cc-title">${c.a} (Tier ${c.tier_a}, ${Math.round(c.rating_a)}) vs ${c.b} (Tier ${c.tier_b}, ${Math.round(c.rating_b)})</div>
        <div class="cc-detail">Only ${c.gap} rating points apart despite sitting in different tiers · played each other ${c.played_before}x so far</div>
        <div class="matchup-vs"><b>${m.team1[0]} &amp; ${m.team1[1]}</b> (${Math.round(m.team1_rating)}) &nbsp;vs&nbsp; <b>${m.team2[0]} &amp; ${m.team2[1]}</b> (${Math.round(m.team2_rating)})<br/><span style="color:var(--text-dim); font-size:11px;">teams balanced within ${m.team_gap} pts</span></div>
      </div>`;
    });
  }

  html += `<div class="section-heading">📋 Players worth calling out</div>`;
  html += `<div class="section-sub">Low-sample players, matched against the closest-rated opponent with a real track record who they haven't already played much — the fastest way to firm up an uncertain number.</div>`;
  CALIBRATION_GAMES.forEach(c=>{
    const b = c.best_anchor;
    const m = c.matchup;
    html += `<div class="callout-card">
      <div class="cc-title">${c.name} (Tier ${c.tier}, ${Math.round(c.rating)}, ${c.games}g) → ${b.opponent} (Tier ${b.tier}, ${Math.round(b.rating)}, ${b.games}g)</div>
      <div class="cc-detail">${c.games} game${c.games===1?'':'s'} on record for ${c.name} · ${b.gap} point gap · played before: ${b.played_before}x</div>
      <div class="matchup-vs"><b>${m.team1[0]} &amp; ${m.team1[1]}</b> (${Math.round(m.team1_rating)}) &nbsp;vs&nbsp; <b>${m.team2[0]} &amp; ${m.team2[1]}</b> (${Math.round(m.team2_rating)})<br/><span style="color:var(--text-dim); font-size:11px;">teams balanced within ${m.team_gap} pts</span></div>
    </div>`;
  });

  box.innerHTML = html;
}

let playersTierFilter = 'All';
let playersActiveFilter = 'all'; // 'all' | 'active' | 'inactive'
let playersSortBy = 'name';      // 'name' | 'rating'

// A player's name is free text, and it is both rendered as text and carried in
// a data attribute, so quotes and angle brackets have to be neutralised for
// both. A name containing `<b>` is a name, not markup: without this it renders
// as "ac" and loses two characters of somebody's identity. The name is read
// back from the element rather than spliced into an inline handler, which is
// what the old rows did -- `onclick="openSheet('...')"` with an apostrophe in
// a name is one bad surname away from a syntax error.
function escapeHtml(value){
  return String(value)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Secondary filters stay folded until asked for. Not persisted: the Directory
// should open the same way every time.
let playersFiltersOpen = false;

function renderPlayersTab(){
  const box = document.getElementById('playersView');

  let rows = [...PLAYERS];
  if(playersTierFilter !== 'All') rows = rows.filter(p => p.tier === playersTierFilter);
  if(playersActiveFilter === 'active') rows = rows.filter(p => p.active);
  else if(playersActiveFilter === 'inactive') rows = rows.filter(p => !p.active);
  if(query) rows = rows.filter(p => p.name.toLowerCase().includes(query));

  if(playersSortBy === 'rating') rows.sort((a,b)=> b.rating - a.rating);
  else rows.sort((a,b)=> a.name.localeCompare(b.name));

  // What the folded control says, so the filter state is legible without
  // opening it. Anything other than "everyone" is worth announcing.
  const tierText = playersTierFilter === 'All' ? 'All tiers' : `Tier ${playersTierFilter}`;
  const statusText = playersActiveFilter === 'all' ? 'all players'
    : (playersActiveFilter === 'active' ? 'active only' : 'inactive only');
  const filtered = playersTierFilter !== 'All' || playersActiveFilter !== 'all';

  // The filter is a line of text you can tap, the same quiet disclosure the
  // Games, League and Requests screens use. It was a bordered card with a
  // dropdown arrow -- the treatment rejected on the League screen and replaced
  // everywhere else, which this screen predated and never caught up with.
  let html = `<button type="button" class="pdir-filter-line${filtered ? ' is-on' : ''}" id="playersFilterToggle"
      aria-expanded="${playersFiltersOpen}" aria-controls="playersFilterPanel">
      Filters · <span class="pdir-filter-state">${tierText}, ${statusText}</span>
      <span class="lg-inline-chev" aria-hidden="true">${playersFiltersOpen ? '⌄' : '›'}</span>
    </button>`;

  if(playersFiltersOpen){
    html += `<div class="pdir-filters" id="playersFilterPanel">
      <div class="fg-row"><label class="fg-label">Tier</label>
        <div class="pdir-tierbar" id="playersTierBar"></div>
      </div>
      <div class="fg-row"><label class="fg-label">Status</label>
        <div class="fg-toggle" id="playersActiveToggle">
          <button class="fg-toggle-btn ${playersActiveFilter==='all'?'active':''}" data-active="all">All</button>
          <button class="fg-toggle-btn ${playersActiveFilter==='active'?'active':''}" data-active="active">Active</button>
          <button class="fg-toggle-btn ${playersActiveFilter==='inactive'?'active':''}" data-active="inactive">Inactive</button>
        </div>
      </div>
    </div>`;
  }

  if(rows.length === 0){
    html += `<div class="pdir-countbar"><span class="pdir-count">0 players · filtered</span></div>`;
    html += `<div class="section-sub">No players match that filter.</div>`;
    box.innerHTML = html;
    wirePlayersControls();
    return;
  }

  // Count on the left, sort on the right: one slim line where there used to
  // be a count under two full-width form buttons.
  html += `<div class="pdir-countbar">
    <span class="pdir-count">${rows.length} player${rows.length===1?'':'s'}${filtered ? ' · filtered' : ''}</span>
    <div class="pdir-seg" id="playersSortToggle" role="group" aria-label="Sort players">
      <button type="button" class="fg-toggle-btn ${playersSortBy==='name'?'active':''}" data-sortby="name" aria-pressed="${playersSortBy==='name'}">A–Z</button>
      <button type="button" class="fg-toggle-btn ${playersSortBy==='rating'?'active':''}" data-sortby="rating" aria-pressed="${playersSortBy==='rating'}">Power Rating</button>
    </div>
  </div>`;

  // Letter headings only make sense alphabetically. Sorted by rating they
  // would mark divisions that are not there.
  let lastLetter = '';
  rows.forEach(p=>{
    if(playersSortBy === 'name'){
      const letter = p.name[0].toUpperCase();
      if(letter !== lastLetter){
        html += `<div class="pdir-letter">${escapeHtml(letter)}</div>`;
        lastLetter = letter;
      }
    }
    // Active is the normal state and does not need to shout on every row;
    // inactive is the one worth noticing, and the whole row quietens with it.
    const inactive = p.active ? '' : `<span class="pdir-inactive">Inactive</span>`;
    const tierKey = String(p.tier || '').toLowerCase();
    // A player card, not a record: the same initials avatar Home uses for the
    // people in a suggested game, tinted by the club's own tier colours, so a
    // glance down the list reads tiers before it reads a single word.
    html += `<button type="button" class="pdir-row pdir-tier-${escapeHtml(tierKey)}${p.active ? '' : ' is-inactive'}" data-player="${escapeHtml(p.name)}">
      <span class="pdir-avatar" aria-hidden="true">${escapeHtml(initials(p.name))}</span>
      <span class="pdir-main">
        <span class="pdir-name">${escapeHtml(p.name)}</span>
        <span class="pdir-meta">Tier ${escapeHtml(p.tier)} · <b>${Math.round(p.rating)}</b></span>
      </span>
      <span class="pdir-right">${inactive}<span class="pdir-chev" aria-hidden="true">›</span></span>
    </button>`;
  });

  box.innerHTML = html;
  wirePlayersControls();
}

function wirePlayersControls(){
  // The tier chips only exist while the filters are open.
  const bar = document.getElementById('playersTierBar');
  if(bar){
    TIERS.forEach(t=>{
      const b = document.createElement('button');
      b.className = 'tierbtn' + (t===playersTierFilter ? ' active' : '');
      b.textContent = t === 'All' ? 'All' : 'Tier ' + t;
      b.onclick = ()=>{ playersTierFilter = t; renderPlayersTab(); };
      bar.appendChild(b);
    });
  }
  const toggle = document.getElementById('playersFilterToggle');
  if(toggle) toggle.onclick = ()=>{ playersFiltersOpen = !playersFiltersOpen; renderPlayersTab(); };

  document.querySelectorAll('#playersActiveToggle .fg-toggle-btn').forEach(b=>{
    b.onclick = ()=>{ playersActiveFilter = b.dataset.active; renderPlayersTab(); };
  });
  document.querySelectorAll('#playersSortToggle .fg-toggle-btn').forEach(b=>{
    b.onclick = ()=>{ playersSortBy = b.dataset.sortby; renderPlayersTab(); };
  });
  // A row is a button now, so the name no longer has to survive being spliced
  // into an inline onclick -- it is read back from the element.
  document.querySelectorAll('#playersView .pdir-row').forEach(el=>{
    el.onclick = ()=> openSheet(el.dataset.player);
  });
}

// ===== Find a Game =====
function h2hCount(a,b){ return H2H[[a,b].sort().join('|')] || 0; }

let fgPlayer = null;
// True once the user has deliberately picked someone other than the
// app-wide selected player to find a game on their behalf -- while true,
// a global player switch (viewerchanged) leaves fgPlayer alone rather than
// stomping that deliberate choice. Cleared again the moment they pick the
// viewer's own name back, which is what lets a global switch resume
// syncing -- see syncFindGamePlayerToViewer below.
let fgPlayerIsOverride = false;
let fgScope = 'tier';
let fgDiff = 'easy';
// Build a Match -- optional constraints layered on top of the same engine.
// '' means "Anyone" (no constraint), matching the select's placeholder option.
let fgPlayWith = '';
let fgPlayAgainst = '';
let fgBuildMatchOpen = false;

// Populated fresh on every call (player/constraint selections change what's
// valid to offer in the *other* two selects) -- cheap, ~40 players.
function populateBuildMatchSelects(){
  const withSel = document.getElementById('fgPlayWithSelect');
  const againstSel = document.getElementById('fgPlayAgainstSelect');
  if(!withSel || !againstSel) return;
  const names = [...PLAYERS].map(p=>p.name).sort((a,b)=>a.localeCompare(b));

  // Validation: the selected player can't appear in either list, and Play
  // With / Play Against can't offer each other's current value -- never
  // silently drop a constraint, just don't let an impossible one be picked.
  const withOptions = names.filter(n=>n!==fgPlayer && n!==fgPlayAgainst);
  const againstOptions = names.filter(n=>n!==fgPlayer && n!==fgPlayWith);
  if(fgPlayWith && !withOptions.includes(fgPlayWith)) fgPlayWith = '';
  if(fgPlayAgainst && !againstOptions.includes(fgPlayAgainst)) fgPlayAgainst = '';

  withSel.innerHTML = `<option value="">Anyone</option>` + withOptions.map(n=>`<option value="${n}" ${n===fgPlayWith?'selected':''}>${n}</option>`).join('');
  againstSel.innerHTML = `<option value="">Anyone</option>` + againstOptions.map(n=>`<option value="${n}" ${n===fgPlayAgainst?'selected':''}>${n}</option>`).join('');
}

function initFindGame(){
  const sel = document.getElementById('fgPlayerSelect');
  if(sel.options.length === 0){
    const sorted = [...PLAYERS].sort((a,b)=>a.name.localeCompare(b.name));
    sorted.forEach(p=>{
      const opt = document.createElement('option');
      opt.value = p.name;
      opt.textContent = `${p.name} (Tier ${p.tier})`;
      sel.appendChild(opt);
    });
    // Initialise from the app-wide selected player (the same identity Home
    // and Player Profile use) rather than an arbitrary default -- falls
    // back to the alphabetically-first player only if nobody's selected one.
    const viewer = getCurrentViewer();
    fgPlayer = (viewer && PLAYERS.find(p=>p.name===viewer.name)) ? viewer.name : sorted[0].name;
    sel.addEventListener('change', e=>{
      fgPlayer = e.target.value;
      const v = getCurrentViewer();
      // Picking the viewer's own name back "resets" -- future global player
      // switches resume syncing here again.
      fgPlayerIsOverride = !v || fgPlayer !== v.name;
      populateBuildMatchSelects(); renderFindGameResults();
    });

    document.getElementById('buildMatchToggle').onclick = ()=>{
      fgBuildMatchOpen = !fgBuildMatchOpen;
      const panel = document.getElementById('buildMatchPanel');
      panel.hidden = !fgBuildMatchOpen;
      document.getElementById('buildMatchToggle').textContent = fgBuildMatchOpen ? 'Build a Match ‹' : 'Build a Match ›';
    };
    document.getElementById('fgPlayWithSelect').addEventListener('change', e=>{ fgPlayWith = e.target.value; populateBuildMatchSelects(); renderFindGameResults(); });
    document.getElementById('fgPlayAgainstSelect').addEventListener('change', e=>{ fgPlayAgainst = e.target.value; populateBuildMatchSelects(); renderFindGameResults(); });
  }
  // Always reflects current fgPlayer, however it was last set (deliberate
  // pick, or a sync from a global player switch that happened while this
  // tab wasn't even open) -- see syncFindGamePlayerToViewer.
  sel.value = fgPlayer;
  populateBuildMatchSelects();
  document.querySelectorAll('#fgScopeToggle .fg-toggle-btn').forEach(b=>{
    b.onclick = ()=>{ fgScope = b.dataset.scope; document.querySelectorAll('#fgScopeToggle .fg-toggle-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); renderFindGameResults(); };
  });
  document.querySelectorAll('#fgDiffToggle .fg-toggle-btn').forEach(b=>{
    b.onclick = ()=>{ fgDiff = b.dataset.diff; document.querySelectorAll('#fgDiffToggle .fg-toggle-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); renderFindGameResults(); };
  });
}

// Keeps Find Game's Player field aligned with the app-wide selected player
// on a global switch (Home's player picker), unless the user has
// deliberately chosen someone else here to find a game on their behalf
// (fgPlayerIsOverride -- cleared again if they pick the viewer's own name
// back). Safe to call even when Find Game isn't the active tab/isn't
// mounted yet; initFindGame() re-applies fgPlayer to the select next time
// it actually renders.
function syncFindGamePlayerToViewer(){
  if(fgPlayerIsOverride) return;
  const viewer = getCurrentViewer();
  if(!viewer || !PLAYERS.find(p=>p.name===viewer.name) || fgPlayer === viewer.name) return;
  fgPlayer = viewer.name;
  const sel = document.getElementById('fgPlayerSelect');
  if(sel && sel.options.length){ sel.value = fgPlayer; populateBuildMatchSelects(); }
  if(activeTab === 'findgame') renderFindGameResults();
}

function generateCandidatePairs(player, scope, diff, topN){
  const pool = PLAYERS.filter(p => p.name !== player.name && !INACTIVE_PLAYERS.has(p.name) && (scope==='any' || p.tier === player.tier));
  let target;
  if(scope === 'tier'){
    const tierRatings = PLAYERS.filter(p=>p.tier===player.tier && !INACTIVE_PLAYERS.has(p.name)).map(p=>p.rating);
    const tierMin = Math.min(...tierRatings), tierMax = Math.max(...tierRatings);
    target = diff==='easy' ? tierMin : (diff==='hard' ? tierMax : player.rating);
  } else {
    target = diff==='easy' ? player.rating - 150 : (diff==='hard' ? player.rating + 150 : player.rating);
  }

  const results = [];
  for(let i=0; i<pool.length; i++){
    for(let j=i+1; j<pool.length; j++){
      const p = pool[i], q = pool[j];
      const avg = (p.rating + q.rating) / 2;
      const gap = Math.abs(avg - target);
      const h2h_p = h2hCount(player.name, p.name);
      const h2h_q = h2hCount(player.name, q.name);
      results.push({ pair: [p.name, q.name], tiers: [p.tier, q.tier], avg: Math.round(avg*10)/10,
                      gap: Math.round(gap*10)/10, played_p: h2h_p, played_q: h2h_q });
    }
  }
  results.sort((a,b)=> a.gap - b.gap || (a.played_p+a.played_q) - (b.played_p+b.played_q));
  return results.slice(0, topN);
}

function generateCandidatePartners(player, scope, topN){
  const pool = PLAYERS.filter(p => p.name !== player.name && !INACTIVE_PLAYERS.has(p.name) && (scope==='any' || p.tier === player.tier));
  const poolNames = new Set(pool.map(p=>p.name));

  // known chemistry first
  const history = PARTNERSHIPS
    .filter(pt => pt.pair.includes(player.name) && poolNames.has(pt.pair[0]===player.name ? pt.pair[1] : pt.pair[0]))
    .map(pt => {
      const partnerName = pt.pair[0]===player.name ? pt.pair[1] : pt.pair[0];
      return { name: partnerName, source: 'history', games: pt.games, wins: pt.wins, losses: pt.losses,
               winpct: pt.winpct, chemistry: pt.avg_overperf };
    })
    .sort((a,b)=> b.chemistry - a.chemistry);

  const usedNames = new Set(history.map(h=>h.name));
  const fresh = pool
    .filter(p => !usedNames.has(p.name))
    .map(p => ({ name: p.name, source: 'fresh', tier: p.tier, rating: p.rating,
                 gap: Math.round(Math.abs(p.rating - player.rating)*10)/10,
                 played: h2hCount(player.name, p.name) }))
    .sort((a,b)=> a.gap - b.gap);

  return { history: history.slice(0, 2), fresh: fresh.slice(0, topN) };
}

function suggestPartnerForTarget(player, targetTeamAvg, scope, excludeNames){
  const excluded = new Set([player.name, ...(excludeNames || [])]);
  const pool = PLAYERS.filter(p => !excluded.has(p.name) && !INACTIVE_PLAYERS.has(p.name) && (scope==='any' || p.tier === player.tier));
  const idealPartnerRating = 2*targetTeamAvg - player.rating;

  let closest = null;
  pool.forEach(p=>{
    const gap = Math.abs(p.rating - idealPartnerRating);
    if(closest===null || gap < closest.gap) closest = {name:p.name, rating:p.rating, tier:p.tier, gap: Math.round(gap*10)/10};
  });

  const poolNames = new Set(pool.map(p=>p.name));
  const chemMatches = PARTNERSHIPS
    .filter(pt => pt.pair.includes(player.name) && pt.games>=2 && pt.avg_overperf > 3)
    .map(pt => pt.pair[0]===player.name ? pt.pair[1] : pt.pair[0])
    .filter(n => poolNames.has(n));

  return { closest, chemistryPartner: chemMatches.length ? chemMatches[0] : null };
}

// ===== Complete-match recommendations (Play / Find Game) =====
// Assembles the same two building blocks the legacy "Suggested opponents &
// who to bring" list already used -- generateCandidatePairs (opponent-pair
// ranking, scope/difficulty aware) and suggestPartnerForTarget (the partner
// who'd make that specific pair an even match, with a proven-chemistry flag)
// -- into single four-player recommendations instead of two separate lists.
// The predicted split reuses the same Elo expected-score formula already
// used for every other predicted outcome in the app (see enrichMatches /
// computeElo). No new matchmaking math, just a different presentation.
function lookupPartnership(a, b){
  return PARTNERSHIPS.find(pt => pt.pair.includes(a) && pt.pair.includes(b)) || null;
}

function eloExpectedShare(ratingFor, ratingAgainst){
  return 1/(1+Math.pow(10,(ratingAgainst-ratingFor)/400));
}

function buildCompleteMatch(player, oppCandidate, scope){
  const ps = suggestPartnerForTarget(player, oppCandidate.avg, scope, oppCandidate.pair);
  if(!ps.closest) return null;
  const partner = PLAYERS.find(p=>p.name===ps.closest.name);
  return buildCompleteMatchWithPartner(player, partner, oppCandidate);
}

// Same scoring/description logic as buildCompleteMatch, but for a partner
// that's already fixed (Build a Match's "Play with", or a completed
// Challenge) instead of one the engine chooses via suggestPartnerForTarget.
function buildCompleteMatchWithPartner(player, partner, oppCandidate){
  const opponents = [PLAYERS.find(p=>p.name===oppCandidate.pair[0]), PLAYERS.find(p=>p.name===oppCandidate.pair[1])];
  if(!partner || !opponents[0] || !opponents[1]) return null;

  const teamRating = (player.rating + partner.rating) / 2;
  const oppRating = oppCandidate.avg;
  const pct = Math.round(eloExpectedShare(teamRating, oppRating) * 100);
  const partnership = lookupPartnership(player.name, partner.name);
  const exposure = (partnership ? partnership.games : 0) + oppCandidate.played_p + oppCandidate.played_q;

  const veryEven = Math.abs(pct-50) <= 3;
  const balanceDesc = veryEven ? 'Almost perfectly balanced'
    : (pct > 50 ? `A slight edge to ${player.name}'s side` : 'A slight edge to the opponents');
  const partnerClause = partnership
    ? `a partnership with real chemistry (${partnership.wins}-${partnership.losses} together, ${partnership.avg_overperf>=0?'+':''}${partnership.avg_overperf}% overperformance)`
    : 'a fresh partnership combination';
  const whyLine = `${veryEven ? 'Very even ratings' : balanceDesc} with ${partnerClause}.`;
  // The same reason without the favourite call, for players (canSeePredictions).
  const ratingGap = Math.round(Math.abs(teamRating - oppRating));
  const whyLinePublic = `${veryEven ? 'Very even ratings' : `Team ratings ${ratingGap} points apart`} with ${partnerClause}.`;

  return {
    player, partner, opponents, tiers: oppCandidate.tiers,
    teamRating: Math.round(teamRating*10)/10, oppRating,
    pctFor: pct, pctAgainst: 100-pct,
    balanceDesc, whyLine, whyLinePublic, partnership, exposure,
    gap: oppCandidate.gap, playedOpp: [oppCandidate.played_p, oppCandidate.played_q],
  };
}

// Operates on any already-built matches array (plain Find Game or a
// constrained Build a Match run) -- purely a labeling pass over whatever
// candidates were produced, so Build a Match gets the same Fresh/Proven/
// Tougher treatment for free instead of a second, parallel implementation.
function categorizeAlternatives(matches, diff){
  const best = matches[0];
  const rest = matches.slice(1);
  const used = new Set();
  const alternatives = [];

  // Fresh Matchup -- the remaining option you (and your assembled team) have
  // the least shared history with, only labeled when that's genuinely low.
  const freshest = rest.filter(m=>!used.has(m)).sort((a,b)=>a.exposure-b.exposure)[0];
  if(freshest && freshest.exposure <= 2){
    alternatives.push({ tag:'Fresh Matchup', tagline:"A combination you haven't played much.", match: freshest });
    used.add(freshest);
  }

  // Proven Chemistry -- only when a remaining option's assembled partner
  // actually has a real (2+ game) partnership record.
  const proven = rest.filter(m=>!used.has(m) && m.partnership).sort((a,b)=>b.partnership.avg_overperf-a.partnership.avg_overperf)[0];
  if(proven){
    alternatives.push({ tag:'Proven Chemistry', tagline:'A partnership with a strong track record.', match: proven });
    used.add(proven);
  }

  // Tougher Test -- a genuinely stronger opponent pair than BEST MATCH,
  // only offered once you've already chosen Balanced or Hard.
  if(diff !== 'easy'){
    const tougher = rest.filter(m=>!used.has(m) && m.oppRating > best.oppRating).sort((a,b)=>b.oppRating-a.oppRating)[0];
    if(tougher){
      alternatives.push({ tag:'Tougher Test', tagline:'A stronger pair, if you want the harder test.', match: tougher });
      used.add(tougher);
    }
  }

  return alternatives.slice(0,3);
}

// A candidate pool large enough to cover every possible pair among the
// group (~40 players -> at most C(40,2)=780) -- used whenever a Build a
// Match constraint needs to filter the *full* ranked candidate list rather
// than just the first few, so a valid combination further down the gap-
// ranking is never missed just because it wasn't in the usual top 10.
const FG_ALL_CANDIDATES = 999;

// Build a Match: 'playWith'/'playAgainst' are optional player names (empty
// string = no constraint = identical output to plain Find Game). This is a
// filtering layer in front of the same generateCandidatePairs ranking, not
// a new matchmaking algorithm -- see the report note on where the
// difficulty *target* still anchors when a partner is fixed.
function buildFindGameRecommendations(player, scope, diff, playWith, playAgainst){
  playWith = playWith || '';
  playAgainst = playAgainst || '';

  let candidates = generateCandidatePairs(player, scope, diff, FG_ALL_CANDIDATES);
  if(playAgainst) candidates = candidates.filter(c => c.pair.includes(playAgainst));
  if(playWith) candidates = candidates.filter(c => !c.pair.includes(playWith));
  candidates = candidates.slice(0, 10);

  let matches;
  if(playWith){
    const partner = PLAYERS.find(p=>p.name===playWith);
    matches = candidates.map(c => buildCompleteMatchWithPartner(player, partner, c)).filter(Boolean);
  } else {
    matches = candidates.map(c => buildCompleteMatch(player, c, scope)).filter(Boolean);
  }
  if(matches.length === 0) return null;

  return { best: matches[0], alternatives: categorizeAlternatives(matches, diff), all: matches };
}

function pmInitials(name){
  return name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
}

function renderMatchTeams(m){
  return `<div class="pm-teams">
    <div class="pm-team pm-team-a">
      <div class="pm-team-player"><span class="pm-avatar">${pmInitials(m.player.name)}</span><span class="pm-name">${m.player.name}</span></div>
      <div class="pm-team-player"><span class="pm-avatar">${pmInitials(m.partner.name)}</span><span class="pm-name">${m.partner.name}</span></div>
    </div>
    <div class="pm-vs">VS</div>
    <div class="pm-team pm-team-b">
      <div class="pm-team-player"><span class="pm-avatar">${pmInitials(m.opponents[0].name)}</span><span class="pm-name">${m.opponents[0].name}</span></div>
      <div class="pm-team-player"><span class="pm-avatar">${pmInitials(m.opponents[1].name)}</span><span class="pm-name">${m.opponents[1].name}</span></div>
    </div>
  </div>`;
}

function renderBestMatchCard(m, label){
  const tierNote = m.tiers[0]===m.tiers[1] ? `Tier ${m.tiers[0]}` : `Tier ${m.tiers[0]} &amp; Tier ${m.tiers[1]}`;
  const partnershipLine = m.partnership
    ? `${m.player.name} &amp; ${m.partner.name}: ${m.partnership.games} games together, ${m.partnership.wins}-${m.partnership.losses} (${m.partnership.winpct}%)`
    : `${m.player.name} and ${m.partner.name} haven't built up a partnership record together yet.`;
  return `<div class="pm-best mp-card-prestige">
    <div class="pm-best-label">${label || 'Best Match'}</div>
    ${canSeePredictions() ? `<div class="pm-best-pct">${m.pctFor}% – ${m.pctAgainst}%</div>
    <div class="pm-best-balance">${m.balanceDesc}</div>` : ''}
    ${renderMatchTeams(m)}
    <div class="pm-why">${canSeePredictions() ? m.whyLine : m.whyLinePublic}</div>
    <div class="pm-actions">
      <button class="mp-btn-primary" id="pmRequestBtn">Request Game ›</button>
      <button class="mp-btn-secondary" id="pmDetailBtn">View Full Breakdown</button>
    </div>
    <div class="pm-detail" id="pmDetail" hidden>
      <div class="pm-detail-line"><b>${m.player.name} &amp; ${m.partner.name}</b> — avg rating ${m.teamRating}</div>
      <div class="pm-detail-line"><b>${m.opponents[0].name} &amp; ${m.opponents[1].name}</b> (${tierNote}) — avg rating ${m.oppRating}</div>
      <div class="pm-detail-line">${partnershipLine}</div>
      <div class="pm-detail-line">You've played ${m.opponents[0].name} ${m.playedOpp[0]}x and ${m.opponents[1].name} ${m.playedOpp[1]}x.</div>
    </div>
  </div>`;
}

function renderAltCard(alt, idx){
  const m = alt.match;
  return `<div class="pm-alt-card">
    <div class="pm-alt-tag">${alt.tag}</div>
    <div class="pm-alt-tagline">${alt.tagline}</div>
    <div class="pm-alt-teams">
      <span><b>${m.player.name} &amp; ${m.partner.name}</b></span>
      <span class="pm-alt-vs">vs</span>
      <span><b>${m.opponents[0].name} &amp; ${m.opponents[1].name}</b></span>
    </div>
    ${canSeePredictions() ? `<div class="pm-alt-pct">${m.pctFor}% – ${m.pctAgainst}% · ${m.balanceDesc.toLowerCase()}</div>` : ''}
    <button class="pm-alt-cta-btn" data-alt-idx="${idx}">Request this instead ›</button>
  </div>`;
}

function renderSeeAllSection(matches){
  const rows = matches.map(m=>`<div class="pm-all-row">
      <span><b>${m.player.name} &amp; ${m.partner.name}</b> vs <b>${m.opponents[0].name} &amp; ${m.opponents[1].name}</b></span>
      ${canSeePredictions() ? `<span class="pm-all-pct">${m.pctFor}%–${m.pctAgainst}%</span>` : ''}
    </div>`).join('');
  return `<button class="pm-seeall-btn" id="pmSeeAllBtn">See all recommendations ›</button>
    <div class="pm-all-list" id="pmAllList" hidden>${rows}</div>`;
}

// Navigates to the Requests tab (legacy "wishlist") and pre-fills the four
// players from a recommendation card. Reuses the existing request form and
// its existing submit/validation logic entirely untouched -- this only fills
// fields, the user still reviews and taps "Request this game" themselves,
// same as every other cross-tab prefill in this app (see
// navigateToGamesTabForResult above).
function navigateToWishlistForMatch(m){
  const names = [m.player.name, m.partner.name, m.opponents[0].name, m.opponents[1].name];
  const wishlistTabBtn = document.querySelector('#tabrow .tab-btn[data-tab="wishlist"]');
  if(wishlistTabBtn) wishlistTabBtn.click();
  const p1 = document.getElementById('reqP1');
  if(p1){
    p1.value = names[0];
    document.getElementById('reqP2').value = names[1];
    document.getElementById('reqP3').value = names[2];
    document.getElementById('reqP4').value = names[3];
    const anchor = document.getElementById('reqSubmit');
    if(anchor){ try { anchor.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e){ /* non-critical */ } }
  }
}

// Never a generic "no results" when a Build a Match constraint is active --
// names the specific constraint so the user knows it was honored, not
// silently dropped, per the impossible-combination requirement.
function buildConstraintEmptyMessage(scope, playWith, playAgainst){
  const scopeNote = scope==='tier' ? 'within your tier' : 'across any tier';
  if(playWith && playAgainst) return `No valid match ${scopeNote} with ${playWith} as your partner and ${playAgainst} on the other side — try "Any tier" or a different pairing.`;
  if(playAgainst) return `No opponent pairing ${scopeNote} has ${playAgainst} on the other side — try "Any tier".`;
  if(playWith) return `No opponent pairing ${scopeNote} works with ${playWith} as your partner — try "Any tier".`;
  return `Not enough other players in this scope to suggest a full match — try "Any tier".`;
}

function renderFindGameResults(){
  const player = PLAYERS.find(p=>p.name===fgPlayer);
  if(!player) return;
  const box = document.getElementById('fgResults');
  const recs = buildFindGameRecommendations(player, fgScope, fgDiff, fgPlayWith, fgPlayAgainst);

  if(!recs){
    box.innerHTML = `<div class="section-sub" style="margin-top:6px;">${buildConstraintEmptyMessage(fgScope, fgPlayWith, fgPlayAgainst)}</div>`;
    return;
  }

  const constrained = fgPlayWith || fgPlayAgainst;
  let html = renderBestMatchCard(recs.best, constrained ? 'Your Match' : 'Best Match');
  if(recs.alternatives.length){
    html += `<div class="pm-alt-heading">Alternatives</div>`;
    recs.alternatives.forEach((alt,i)=>{ html += renderAltCard(alt, i); });
  }
  html += renderSeeAllSection(recs.all);
  box.innerHTML = html;

  document.getElementById('pmRequestBtn').onclick = ()=> navigateToWishlistForMatch(recs.best);

  const detailBtn = document.getElementById('pmDetailBtn');
  const detailBox = document.getElementById('pmDetail');
  detailBtn.onclick = ()=>{
    const willShow = detailBox.hidden;
    detailBox.hidden = !willShow;
    detailBtn.textContent = willShow ? 'Hide Breakdown' : 'View Full Breakdown';
  };

  box.querySelectorAll('.pm-alt-cta-btn').forEach(btn=>{
    btn.onclick = ()=>{
      const idx = parseInt(btn.dataset.altIdx, 10);
      navigateToWishlistForMatch(recs.alternatives[idx].match);
    };
  });

  const seeAllBtn = document.getElementById('pmSeeAllBtn');
  const allList = document.getElementById('pmAllList');
  seeAllBtn.onclick = ()=>{
    const willShow = allList.hidden;
    allList.hidden = !willShow;
    seeAllBtn.textContent = willShow ? 'Hide full list ‹' : 'See all recommendations ›';
  };
}

function renderFindGame(){
  initFindGame();
  renderFindGameResults();
}

// ===== Challenge (sequential turn-based match construction) =====
// A small state machine, not a pile of booleans:
//   waiting_first_pick -> waiting_second_pick -> ready -> confirmed
//                      \_______________________/
//                       -> declined / cancelled (either waiting_* state)
// "draft" (the creation form, before Send Challenge) is local UI state only
// -- nothing is persisted until a challenge is actually sent.
//
// Stored under its own Firestore-backed key (challengesState /
// STORAGE_KEY_CHALLENGES, see above) rather than folded into
// gameRequestsState -- that store's shape (a fixed 4 named players +
// per-player confirmations) has no room for "only 2 of 4 players are known
// yet" or turn order without turning every request-reading function
// polymorphic. Once both picks are in, bridgeChallengeToRequest() hands off
// to that exact existing mechanism instead of inventing a parallel one.
//
// IDENTITY NOTE: there is no real login. getCurrentViewer() (presentation
// identity only, per its own doc comment in shell.js) decides which action
// buttons to *show* a given browser -- it is never treated as proof of who
// is actually acting, and nothing here touches the real admin/password
// boundary (isUnlocked). Anyone could open devtools and click a hidden
// button; this is the same trust model the rest of the app already uses
// for e.g. match edits and dev-area notes.
const CHALLENGE_RESTRICTIONS = ['any', ...TIER_ORDER_LIST]; // 'any' | 'S' | 'A' | 'B' | 'C'
function challengeRestrictionLabel(r){ return r==='any' ? 'Any player' : `Tier ${r}`; }
// Mid-sentence form -- "Tier B" keeps its capital, "any player" doesn't
// stay capitalized just because it happens to start the standalone label.
function challengeRestrictionLabelInline(r){ return r==='any' ? 'any player' : `Tier ${r}`; }

function challengeFirstAnchor(ch){ return ch.firstPicker==='challenger' ? ch.challenger : ch.challenged; }
function challengeSecondAnchor(ch){ return ch.firstPicker==='challenger' ? ch.challenged : ch.challenger; }

// Who a given pick may choose from: both anchors and (for the second pick)
// the already-chosen first partner are always excluded -- no duplicate
// player can ever reach the final four -- filtered by that pick's tier
// restriction and by the same inactive-player rule every other matchmaking
// path in this app already uses.
function challengeCandidatePool(ch, restriction, extraExclude){
  const excluded = new Set([ch.challenger, ch.challenged, ...(extraExclude || [])]);
  return PLAYERS.filter(p => !excluded.has(p.name) && !INACTIVE_PLAYERS.has(p.name) && (restriction==='any' || p.tier===restriction));
}

function challengeFinalPlayers(ch){
  if(ch.state!=='ready' && ch.state!=='confirmed') return null;
  const partnerOf = {};
  partnerOf[challengeFirstAnchor(ch)] = ch.firstPartner;
  partnerOf[challengeSecondAnchor(ch)] = ch.secondPartner;
  return [ch.challenger, partnerOf[ch.challenger], ch.challenged, partnerOf[ch.challenged]];
}

// Recomputes the finished match's display live from current PLAYERS data --
// reuses buildCompleteMatchWithPartner exactly as Build a Match does (see
// above), so a completed Challenge renders with the identical card language
// and the identical Elo expected-score formula. Nothing here is persisted.
function challengeToMatchView(ch){
  const players = challengeFinalPlayers(ch);
  if(!players || players.some(p=>!p)) return null;
  const challenger = PLAYERS.find(p=>p.name===ch.challenger);
  const challenged = PLAYERS.find(p=>p.name===ch.challenged);
  const firstAnchor = challengeFirstAnchor(ch);
  const challengerPartner = PLAYERS.find(p=>p.name === (firstAnchor===ch.challenger ? ch.firstPartner : ch.secondPartner));
  const challengedPartner = PLAYERS.find(p=>p.name === (firstAnchor===ch.challenged ? ch.firstPartner : ch.secondPartner));
  if(!challenger || !challenged || !challengerPartner || !challengedPartner) return null;
  return buildCompleteMatchWithPartner(challenger, challengerPartner, {
    pair: [challenged.name, challengedPartner.name],
    tiers: [challenged.tier, challengedPartner.tier],
    avg: (challenged.rating + challengedPartner.rating) / 2,
    played_p: h2hCount(challenger.name, challenged.name),
    played_q: h2hCount(challenger.name, challengedPartner.name),
    gap: 0,
  });
}

function createChallenge(challenger, challenged, firstPicker, firstRestriction, secondRestriction, createdBy){
  return {
    id: 'chl_' + Date.now() + '_' + Math.random().toString(36).slice(2,8),
    createdAt: new Date().toISOString(), createdBy,
    challenger, challenged, firstPicker, firstRestriction, secondRestriction,
    firstPartner: null, secondPartner: null,
    state: 'waiting_first_pick', linkedRequestId: null, respondedAt: null,
  };
}

async function makeFirstPick(ch, partnerName){
  if(ch.state !== 'waiting_first_pick') return false;
  if(!challengeCandidatePool(ch, ch.firstRestriction, []).find(p=>p.name===partnerName)) return false; // enforced, not just displayed
  const prevState = ch.state;
  ch.firstPartner = partnerName;
  ch.state = 'waiting_second_pick';
  const ok = await saveChallenges(challengesState);
  if(!ok){ ch.firstPartner = null; ch.state = prevState; }
  return ok;
}

async function makeSecondPick(ch, partnerName){
  if(ch.state !== 'waiting_second_pick') return false;
  if(!challengeCandidatePool(ch, ch.secondRestriction, [ch.firstPartner]).find(p=>p.name===partnerName)) return false;
  const prevState = ch.state;
  ch.secondPartner = partnerName;
  ch.state = 'ready';
  const ok = await saveChallenges(challengesState);
  if(!ok){ ch.secondPartner = null; ch.state = prevState; return false; }
  await bridgeChallengeToRequest(ch);
  return true;
}

// Once both picks are in, the challenge hands off entirely to the existing
// request/confirmation mechanics: the two anchors are auto-confirmed (they
// each made a deliberate, active choice to get here), but the two drafted
// partners still confirm themselves under Play > Requests, same as any
// ordinary request -- nobody is silently committed to a match they
// didn't agree to. Safe to retry: only pushes a request once linkedRequestId
// is actually set.
async function bridgeChallengeToRequest(ch){
  if(ch.linkedRequestId) return true;
  const players = challengeFinalPlayers(ch);
  if(!players || players.some(p=>!p)) return false;
  const confirmations = {};
  players.forEach(n=> confirmations[n] = false);
  confirmations[ch.challenger] = true;
  confirmations[ch.challenged] = true;
  const req = {
    id: 'req_' + Date.now() + '_' + Math.random().toString(36).slice(2,8),
    requestedBy: ch.createdBy || ch.challenger,
    requestedAt: new Date().toISOString(),
    players, preferredDate: '',
    confirmations,
    courtBookingMade: false,
    status: Object.values(confirmations).every(v=>v) ? 'confirmed' : 'pending',
    history: [{ at: new Date().toISOString(), by: ch.createdBy || ch.challenger, action: 'requested', fromChallenge: ch.id }],
  };
  if(req.status === 'confirmed') req.agreedAt = req.requestedAt;
  gameRequestsState.push(req);
  const ok = await saveGameRequests(gameRequestsState);
  if(!ok){ gameRequestsState.pop(); return false; }
  ch.state = 'confirmed';
  ch.linkedRequestId = req.id;
  return await saveChallenges(challengesState);
}

async function declineChallenge(ch){
  if(ch.state!=='waiting_first_pick' && ch.state!=='waiting_second_pick') return false;
  const prevState = ch.state;
  ch.state = 'declined';
  ch.respondedAt = new Date().toISOString();
  const ok = await saveChallenges(challengesState);
  if(!ok) ch.state = prevState;
  return ok;
}

async function cancelChallenge(ch){
  if(ch.state!=='waiting_first_pick' && ch.state!=='waiting_second_pick') return false;
  const prevState = ch.state;
  ch.state = 'cancelled';
  ch.respondedAt = new Date().toISOString();
  const ok = await saveChallenges(challengesState);
  if(!ok) ch.state = prevState;
  return ok;
}

let chlCreateOpen = false;

function renderChallengeCreateForm(){
  const names = allPlayerNames();
  const nameOptions = (selected) => `<option value="">Choose player</option>` + names.map(n=>`<option value="${n}" ${n===selected?'selected':''}>${n}</option>`).join('');
  const restrictionOptions = CHALLENGE_RESTRICTIONS.map(r=>`<option value="${r}">${challengeRestrictionLabel(r)}</option>`).join('');
  // Challenger defaults to the app-wide selected player -- same identity
  // Find Game and Home use -- since that's who's most likely creating this.
  const viewer = getCurrentViewer();
  const defaultChallenger = (viewer && names.includes(viewer.name)) ? viewer.name : '';
  return `<div class="chl-create-card">
    <div class="chl-create-title">Create Challenge</div>
    <div class="fg-row"><label class="fg-label">Challenger</label><select id="chlChallenger" class="fg-select">${nameOptions(defaultChallenger)}</select></div>
    <div class="fg-row"><label class="fg-label">Challenging</label><select id="chlChallenged" class="fg-select">${nameOptions('')}</select></div>
    <div class="fg-row"><label class="fg-label">Who picks first</label>
      <div class="fg-toggle" id="chlFirstPickerToggle">
        <button class="fg-toggle-btn active" data-picker="challenger">Challenger</button>
        <button class="fg-toggle-btn" data-picker="challenged">Challenged</button>
      </div>
    </div>
    <div class="chl-picker-row fg-row">
      <div><label class="fg-label">First pick restriction</label><select id="chlFirstRestriction" class="fg-select">${restrictionOptions}</select></div>
      <div><label class="fg-label">Second pick restriction</label><select id="chlSecondRestriction" class="fg-select">${restrictionOptions}</select></div>
    </div>
    <div id="chlCreateMessage" class="section-sub"></div>
    <div class="fg-row"><button class="mp-btn-primary" id="chlCreateSubmit" style="width:100%;">Send Challenge</button></div>
  </div>`;
}

function renderChallengeCard(ch, viewer){
  const viewerName = viewer ? viewer.name : null;
  const firstAnchor = challengeFirstAnchor(ch);
  const secondAnchor = challengeSecondAnchor(ch);

  if(ch.state === 'declined' || ch.state === 'cancelled'){
    const label = ch.state === 'declined' ? 'Declined' : 'Cancelled';
    return `<div class="chl-card chl-muted">
      <div class="chl-tag">Challenge</div>
      <div class="chl-matchup-line">${ch.challenger} vs ${ch.challenged}</div>
      <div class="chl-status-row"><span class="chl-status-badge chl-${ch.state}">${label}</span></div>
    </div>`;
  }

  if(ch.state === 'waiting_first_pick' || ch.state === 'waiting_second_pick'){
    const isFirst = ch.state === 'waiting_first_pick';
    const activePicker = isFirst ? firstAnchor : secondAnchor;
    const restriction = isFirst ? ch.firstRestriction : ch.secondRestriction;
    const isViewersTurn = viewerName === activePicker;
    const canDecline = viewerName === ch.challenged;
    const canCancel = viewerName === ch.createdBy;

    const priorPickLine = !isFirst
      ? `<div class="chl-restriction-line">${firstAnchor} chose <b style="color:var(--text);">${ch.firstPartner}</b>.</div>` : '';

    // The challenged player can decline any time before the match is ready
    // -- regardless of whose turn it is, including their own -- so this is
    // built once and dropped into whichever actions row actually renders.
    const cancelBtn = canCancel ? `<button class="mp-btn-secondary chl-cancel-btn" data-challenge-id="${ch.id}">Cancel Challenge</button>` : '';
    const declineBtn = canDecline ? `<button class="mp-btn-secondary chl-decline-btn" data-challenge-id="${ch.id}">Decline</button>` : '';

    let pickPanel = '';
    if(isViewersTurn){
      const pool = challengeCandidatePool(ch, restriction, isFirst ? [] : [ch.firstPartner]).sort((a,b)=>a.name.localeCompare(b.name));
      if(pool.length === 0){
        pickPanel = `<div class="chl-pick-panel">
          <div class="chl-pick-empty">No eligible ${challengeRestrictionLabelInline(restriction)} left to pick — this challenge can't be completed as set up.</div>
          ${(cancelBtn || declineBtn) ? `<div class="chl-actions">${cancelBtn}${declineBtn}</div>` : ''}
        </div>`;
      } else {
        pickPanel = `<div class="chl-pick-panel">
          <select class="fg-select chl-partner-select" id="chlPartnerSelect-${ch.id}">${pool.map(p=>`<option value="${p.name}">${p.name} (Tier ${p.tier})</option>`).join('')}</select>
          <div class="chl-actions">
            <button class="mp-btn-primary chl-choose-btn" data-challenge-id="${ch.id}">Choose Partner</button>
            ${cancelBtn}${declineBtn}
          </div>
        </div>`;
      }
    } else if(cancelBtn || declineBtn){
      pickPanel = `<div class="chl-actions">${cancelBtn}${declineBtn}</div>`;
    }

    const badge = isViewersTurn
      ? `<span class="chl-status-badge chl-your-turn">Your turn</span>`
      : `<span class="chl-status-badge">Waiting for ${activePicker}</span>`;

    return `<div class="chl-card">
      <div class="chl-tag">Challenge</div>
      <div class="chl-matchup-line">${ch.challenger} vs ${ch.challenged}</div>
      <div class="chl-restriction-line">${activePicker} picks ${isFirst?'first':'second'} — partner must be ${challengeRestrictionLabelInline(restriction)}.</div>
      ${priorPickLine}
      <div class="chl-status-row">${badge}</div>
      ${pickPanel}
    </div>`;
  }

  // 'ready' (mid-bridge / bridge failed) or 'confirmed' -- show the finished
  // match with the same card language as Build a Match, plus the real
  // confirmation state of the request it was bridged into.
  const mv = challengeToMatchView(ch);
  if(!mv){
    return `<div class="chl-card"><div class="chl-tag">Challenge</div><div class="chl-matchup-line">${ch.challenger} vs ${ch.challenged}</div><div class="chl-restriction-line">Match ready, but a chosen player is no longer available to display.</div></div>`;
  }
  const linkedReq = ch.linkedRequestId ? gameRequestsState.find(r=>r.id===ch.linkedRequestId) : null;
  return `<div class="chl-card">
    <div class="chl-tag">Challenge · Match ready</div>
    ${renderMatchTeams(mv)}
    ${canSeePredictions() ? `<div class="pm-best-pct" style="margin-top:8px;">${mv.pctFor}% – ${mv.pctAgainst}%</div>
    <div class="pm-best-balance">${mv.balanceDesc}</div>` : ''}
    ${linkedReq
      ? fmtRequestConfirmations(linkedReq)
      : `<div class="chl-restriction-line chl-ready">Couldn't finalize this into a request.</div><div class="chl-actions"><button class="mp-btn-primary chl-retry-bridge-btn" data-challenge-id="${ch.id}">Retry</button></div>`}
  </div>`;
}

// Higher = more relevant to this viewer: their own turn first, then any
// challenge they're actually part of, then everything else -- so the
// global player context decides what surfaces first here too, not just
// who can act on a given card.
function challengeRelevanceScore(ch, viewer){
  if(!viewer) return 0;
  const name = viewer.name;
  const isYourTurn = (ch.state==='waiting_first_pick' && challengeFirstAnchor(ch)===name)
    || (ch.state==='waiting_second_pick' && challengeSecondAnchor(ch)===name);
  if(isYourTurn) return 2;
  if(ch.challenger===name || ch.challenged===name) return 1;
  return 0;
}

function renderChallengesSection(){
  const viewer = getCurrentViewer();
  const active = challengesState.filter(c => c.state!=='confirmed').slice().sort((a,b)=>
    challengeRelevanceScore(b, viewer) - challengeRelevanceScore(a, viewer) || (a.createdAt < b.createdAt ? 1 : -1));

  // The heading is the fold above this (see renderWishlist); repeating it here
  // would give the section two.
  let html = `<div class="section-sub">Call someone out — one side picks a partner first, then the other responds.</div>`;
  html += chlCreateOpen ? renderChallengeCreateForm() : `<button class="chl-create-toggle" id="chlOpenCreate">+ Create Challenge</button>`;

  if(active.length === 0){
    html += `<div class="section-sub">No open challenges right now.</div>`;
  } else {
    active.forEach(ch=>{ html += renderChallengeCard(ch, viewer); });
  }
  return html;
}

// Wires everything renderChallengesSection() just put into `box` -- called
// from renderWishlist() right after it sets box.innerHTML, alongside that
// function's own wiring for the legacy request form.
function wireChallengeControls(box, flashMessage, adminFlashMessage){
  const openBtn = document.getElementById('chlOpenCreate');
  if(openBtn) openBtn.onclick = ()=>{ chlCreateOpen = true; renderWishlist(flashMessage, adminFlashMessage); };

  const firstPickerToggle = document.getElementById('chlFirstPickerToggle');
  if(firstPickerToggle){
    firstPickerToggle.querySelectorAll('.fg-toggle-btn').forEach(b=>{
      b.onclick = ()=>{ firstPickerToggle.querySelectorAll('.fg-toggle-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); };
    });
  }

  const chlSubmit = document.getElementById('chlCreateSubmit');
  if(chlSubmit){
    chlSubmit.onclick = async ()=>{
      const msg = document.getElementById('chlCreateMessage');
      const challenger = document.getElementById('chlChallenger').value;
      const challenged = document.getElementById('chlChallenged').value;
      if(!challenger || !challenged){ msg.textContent = 'Choose both players.'; return; }
      if(challenger === challenged){ msg.textContent = 'Challenger and challenged must be different players.'; return; }
      const firstPickerBtn = document.querySelector('#chlFirstPickerToggle .fg-toggle-btn.active');
      const firstPicker = firstPickerBtn ? firstPickerBtn.dataset.picker : 'challenger';
      const firstRestriction = document.getElementById('chlFirstRestriction').value;
      const secondRestriction = document.getElementById('chlSecondRestriction').value;
      // createdBy is compared against getCurrentViewer() (see canCancel below),
      // so it must be recorded from that same identity source -- currentUserName
      // is a separate, free-text field (the legacy request form's "Requested
      // by") and comparing one against the other would silently break Cancel.
      const viewerNow = getCurrentViewer();
      const createdBy = (viewerNow ? viewerNow.name : currentUserName) || challenger;
      const ch = createChallenge(challenger, challenged, firstPicker, firstRestriction, secondRestriction, createdBy);
      challengesState.push(ch);
      const ok = await saveChallenges(challengesState);
      if(!ok){
        challengesState.pop();
        msg.textContent = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage.`;
        return;
      }
      chlCreateOpen = false;
      renderWishlist('Challenge sent!');
    };
  }

  box.querySelectorAll('.chl-choose-btn').forEach(btn=>{
    btn.onclick = async ()=>{
      const ch = challengesState.find(c=>c.id===btn.dataset.challengeId);
      if(!ch) return;
      const sel = document.getElementById('chlPartnerSelect-'+ch.id);
      const partnerName = sel ? sel.value : '';
      if(!partnerName) return;
      if(ch.state === 'waiting_first_pick') await makeFirstPick(ch, partnerName);
      else await makeSecondPick(ch, partnerName);
      renderWishlist(flashMessage, adminFlashMessage);
    };
  });
  box.querySelectorAll('.chl-decline-btn').forEach(btn=>{
    btn.onclick = async ()=>{
      const ch = challengesState.find(c=>c.id===btn.dataset.challengeId);
      if(!ch) return;
      await declineChallenge(ch);
      renderWishlist(flashMessage, adminFlashMessage);
    };
  });
  box.querySelectorAll('.chl-cancel-btn').forEach(btn=>{
    btn.onclick = async ()=>{
      const ch = challengesState.find(c=>c.id===btn.dataset.challengeId);
      if(!ch) return;
      await cancelChallenge(ch);
      renderWishlist(flashMessage, adminFlashMessage);
    };
  });
  box.querySelectorAll('.chl-retry-bridge-btn').forEach(btn=>{
    btn.onclick = async ()=>{
      const ch = challengesState.find(c=>c.id===btn.dataset.challengeId);
      if(!ch) return;
      await bridgeChallengeToRequest(ch);
      renderWishlist(flashMessage, adminFlashMessage);
    };
  });
}

function buildCallOutSection(name){
  if(!canSee('callouts')) return '';
  const relevant = [];
  WITHIN_TIER_GAMES.forEach(c=>{ if(c.a===name || c.b===name) relevant.push(c.matchup); });
  BOUNDARY_TESTS.forEach(c=>{ if(c.a===name || c.b===name) relevant.push(c.matchup); });
  CALIBRATION_GAMES.forEach(c=>{ if(c.name===name) relevant.push(c.matchup); });
  if(relevant.length === 0) return '';
  let html = `<div class="section-heading" style="margin-top:14px;">📋 Call-out for ${name}</div>`;
  relevant.forEach(m=>{
    html += `<div class="matchup-vs"><b>${m.team1[0]} &amp; ${m.team1[1]}</b> (${Math.round(m.team1_rating)}) &nbsp;vs&nbsp; <b>${m.team2[0]} &amp; ${m.team2[1]}</b> (${Math.round(m.team2_rating)})<br/><span style="color:var(--text-dim); font-size:11px;">this would help settle where ${name}'s rating actually sits</span></div>`;
  });
  return html;
}

function buildDifficultySection(name){
  if(!canSee('difficulty')) return '';
  const d = DIFFICULTY_SUGGESTIONS[name];
  if(!d || !d.easy || !d.balanced || !d.hard) return '';
  const easy = d.easy, bal = d.balanced, hard = d.hard;
  const player = PLAYERS.find(p=>p.name===name);
  const tierNote = d.withinTier
    ? `within Tier ${player ? player.tier : ''}`
    : `across any tier — not enough other Tier ${player ? player.tier : ''} players to keep this within-tier`;
  const allSame = (easy.pair.join()===bal.pair.join()) && (bal.pair.join()===hard.pair.join());

  let html = `<div class="section-heading" style="margin-top:14px;">🎮 Suggest a game for ${name}</div>`;
  if(allSame){
    html += `<div class="section-sub">${name}'s rating is far enough out on its own that there's no meaningful easy/hard range (${tierNote}) — this is simply the toughest game available.</div>
      <div class="matchup-vs"><b>${easy.pair[0]} &amp; ${easy.pair[1]}</b> (avg ${Math.round(easy.avg_rating)})</div>`;
  } else {
    html += `<div class="section-sub">Opponent pairs picked so the two-player average lands near an easy / even / hard target relative to ${name}'s own rating, ${tierNote}.</div>
      <div class="difficulty-row">
        <div class="difficulty-pill diff-easy">EASY</div>
        <div class="difficulty-pill diff-balanced">BALANCED</div>
        <div class="difficulty-pill diff-hard">HARD</div>
      </div>
      <div class="matchup-vs"><b>Easy:</b> ${easy.pair[0]} &amp; ${easy.pair[1]} (avg ${Math.round(easy.avg_rating)})</div>
      <div class="matchup-vs"><b>Balanced:</b> ${bal.pair[0]} &amp; ${bal.pair[1]} (avg ${Math.round(bal.avg_rating)})</div>
      <div class="matchup-vs"><b>Hard:</b> ${hard.pair[0]} &amp; ${hard.pair[1]} (avg ${Math.round(hard.avg_rating)})</div>`;
  }

  if(d.crossTier && (!d.withinTier || d.crossTier.pair.join() !== bal.pair.join())){
    html += `<div style="margin-top:10px; font-size:11px; color:var(--gold-soft); text-transform:uppercase; letter-spacing:.04em;">Recommended across tiers</div>
      <div class="matchup-vs"><b>${d.crossTier.pair[0]} &amp; ${d.crossTier.pair[1]}</b> (avg ${Math.round(d.crossTier.avg_rating)}) <span style="color:var(--text-dim); font-size:11px;">— closest overall rating match, any tier</span></div>`;
  }
  return html;
}

function buildRankingNeighborsSection(name){
  const target = PLAYERS.find(p=>p.name===name);
  if(!target) return '';
  const pool = PLAYERS.filter(p => p.active || p.name === name).sort((a,b)=> b.rating - a.rating);
  const idx = pool.findIndex(p=>p.name===name);
  if(idx === -1) return '';
  const above = idx > 0 ? pool[idx-1] : null;
  const below = idx < pool.length-1 ? pool[idx+1] : null;

  let html = `<div class="section-heading" style="margin-top:14px;">📊 Neighbours in the rankings</div>`;
  if(!target.active){
    html += `<div class="section-sub">${name} is inactive — shown against the active player list only.</div>`;
  }
  html += `<div class="matchup-vs">`;
  if(above){
    const gap = Math.round((above.rating - target.rating)*10)/10;
    html += `<div>▲ <b>${above.name}</b> (Tier ${above.tier}, ${Math.round(above.rating)}) — ${gap} pts above</div>`;
  } else {
    html += `<div style="color:var(--text-dim);">▲ Nobody rated higher — top of the board</div>`;
  }
  html += `<div style="margin:6px 0; padding:4px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line); text-align:center; color:var(--gold-bright); font-weight:700;">${name}</div>`;
  if(below){
    const gap = Math.round((target.rating - below.rating)*10)/10;
    html += `<div>▼ <b>${below.name}</b> (Tier ${below.tier}, ${Math.round(below.rating)}) — ${gap} pts below</div>`;
  } else {
    html += `<div style="color:var(--text-dim);">▼ Nobody rated lower — bottom of the board</div>`;
  }
  html += `</div>`;
  return html;
}

// The per-game rating weight shown to users. Derived from the real engine's K (28) times the
// A result within this band of the prediction counts as "played to expectation" -- no rating
// movement is implied either way. This is a DISPLAY band on the engine's own performance
// residual: it decides wording, never a number.
const NEUTRAL_PERFORMANCE_BAND = 0.05; // 5 points of performance score

// The player's real Rating Journey, read straight back from the persisted
// ratingJourney events. Nothing here is reconstructed: every rating, delta,
// expectation and K-factor below was written by the engine at the moment it
// happened. That is why the old "story estimate" disclaimer is gone -- there
// is no second calculation left that could disagree with the Power Rating.
//
// This costs no extra Firestore read: V3_JOURNEY is already in memory for the
// monthly views. It never falls back to a reconstruction; if the journey did
// not load, the UI says so.
function playerJourney(name){
  if(typeof JourneyView === 'undefined') return { error: 'journeyView.js did not load.' };
  if(!V3_STATE.loaded) return { error: String(V3_STATE.error || 'v3 state is not loaded.') };
  if(!V3_JOURNEY.length) return { error: 'The Rating Journey did not load.' };
  const journey = JourneyView.forPlayer(V3_JOURNEY, name);
  if(!journey) return { empty: true };
  return { journey };
}

// Real per-match rating movement for one player, keyed by match id. Used by the
// profile match cards so the figure on a card is the figure the engine applied
// for that player in that match -- not a team-wide approximation.
function journeyDeltasByMatchId(journey){
  const out = {};
  if(!journey) return out;
  journey.entries.forEach(e=>{ if(e.kind === 'match' && e.matchId) out[e.matchId] = e.delta; });
  return out;
}

// One month of a player's real trajectory, sliced out of the persisted journey.
// There is no monthly seed, no monthly re-solve and no separate monthly engine
// -- a month is a window onto one continuous rating, and this cannot express
// anything else. Returns null when the player has no events that month.
function computeMonthlyJourney(name, month){
  if(month === 'all') return null;
  const result = playerJourney(name);
  if(!result.journey) return null;
  return JourneyView.monthSlice(result.journey, month);
}

// ---- Rating journey rendering (all of it reads persisted events) ----

const JOURNEY_MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function journeyDateLabel(iso){
  if(!iso) return '';
  const parts = String(iso).split('-');
  if(parts.length < 3) return String(iso);
  return `${Number(parts[2])} ${JOURNEY_MONTH_ABBR[Number(parts[1])-1] || parts[1]}`;
}
function journeyPct(v){ return (v === null || v === undefined) ? '—' : `${Math.round(v*100)}%`; }
function journeySigned(v){
  if(v === null || v === undefined) return '';
  const r = Math.round(v*10)/10;
  return r > 0 ? `+${r}` : `${r}`;
}
function journeyDeltaHtml(v){
  if(v === null || v === undefined) return '';
  const cls = v > 0 ? 'perf-pos' : (v < 0 ? 'perf-neg' : '');
  return `<span class="${cls}" style="font-weight:700;">${journeySigned(v)} pts</span>`;
}

// The chart. A reassessment and a tier change are drawn differently from a
// match on purpose: one is a club decision, the other moves no rating at all,
// and neither should read as a result on court.
function buildV3JourneyChartSvg(journey){
  const series = JourneyView.chartSeries(journey);
  const w = 320, h = 110, padX = 8, padY = 14;
  const ratings = series.map(s=>s.rating);
  const minR = Math.min(...ratings), maxR = Math.max(...ratings);
  const range = (maxR - minR) || 1;
  const stepX = series.length > 1 ? (w - padX*2) / (series.length - 1) : 0;
  const xy = (s,i) => [padX + i*stepX, padY + (h - padY*2) * (1 - (s.rating - minR)/range)];
  const points = series.map((s,i)=> xy(s,i).map(v=>v.toFixed(1)).join(',')).join(' ');

  const marks = series.map((s,i)=>{
    const [x,y] = xy(s,i);
    if(s.isAnnotation){
      // Annotated, not plotted as movement: the rating did not change here.
      return `<line x1="${x.toFixed(1)}" y1="${(padY-8).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(h-padY+8).toFixed(1)}" stroke="#c8a96a" stroke-width="1" stroke-dasharray="2,3" opacity="0.75"/>`
        + `<rect x="${(x-2.8).toFixed(1)}" y="${(y-2.8).toFixed(1)}" width="5.6" height="5.6" fill="var(--bg, #14120f)" stroke="#c8a96a" stroke-width="1.3"/>`;
    }
    if(s.isJump){
      return `<polygon points="${x.toFixed(1)},${(y-4.4).toFixed(1)} ${(x+4.4).toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${(y+4.4).toFixed(1)} ${(x-4.4).toFixed(1)},${y.toFixed(1)}" fill="#7ba7d4"/>`;
    }
    const color = s.kind === 'match'
      ? (s.delta > 0 ? '#5a9c5a' : (s.delta < 0 ? '#b5453f' : '#a89c82'))
      : '#a89c82';
    const r = (i === series.length-1) ? 4 : 2.3;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${color}"/>`;
  }).join('');

  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%; height:${h}px; display:block;">
    <polyline points="${points}" fill="none" stroke="#a89c82" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" opacity="0.45"/>
    ${marks}
  </svg>`;
}

function journeyMatchDescription(name, matchId){
  const m = MATCHES.find(x => x.id === matchId);
  if(!m) return null;
  const won = m.winners.includes(name);
  const myTeam = won ? m.winners : m.losers;
  const oppTeam = won ? m.losers : m.winners;
  const partner = myTeam.filter(n => n !== name)[0] || null;
  return {
    won, partner, opponents: oppTeam.join(' & '),
    resultWord: m.isDraw ? 'Drew' : (won ? 'Beat' : 'Lost to'),
    score: m.score || '',
  };
}

// One row per event. Every row states what kind of event it was, because the
// kinds are not interchangeable: only a match is a result.
function buildJourneyEventRowHtml(name, e){
  const after = Math.round(e.rating);
  const date = journeyDateLabel(e.date);
  const row = (tag, title, detail) => `<div class="matchup-vs" style="margin-top:6px; padding:8px;">
      <div style="font-size:10px; color:var(--gold-soft); text-transform:uppercase; letter-spacing:.03em;">${date}${tag ? ` · ${tag}` : ''}</div>
      <div style="font-weight:700; color:var(--text); margin-top:2px;">${title}</div>
      <div style="font-size:11.5px; color:var(--text-dim); line-height:1.5; margin-top:2px;">${detail}</div>
    </div>`;

  if(e.kind === 'initialised'){
    return row('Joined', `Entered at Tier ${e.tier || '—'} — starting Power Rating ${after}`,
      `Reliability 0% — no evidence yet. Everything after this point was earned.`);
  }
  if(e.kind === 'tier'){
    const title = e.eventType === 'PROMOTION' ? `Promoted to Tier ${e.tier}`
      : (e.eventType === 'DEMOTION' ? `Moved down to Tier ${e.tier}`
      : `Stayed in Tier ${e.tier}`);
    return row('Tier change', title,
      `Power Rating unchanged at <b>${after}</b>, reliability unchanged at ${journeyPct(e.reliability)}. A tier change moves neither — it changes who ${name} is ranked against, not what the rating says.`);
  }
  if(e.kind === 'correction'){
    // A correction may or may not move the rating: the board is replacing an
    // initial estimate, and sometimes only the tier was wrong. Saying
    // "unchanged" either way was false the moment corrections began carrying a
    // rating decision, and it was false on the most-read screen in the app.
    const moved = !!e.delta;
    const before = e.previousRating === null || e.previousRating === undefined ? null : Math.round(e.previousRating);
    const detail = moved
      ? `Power Rating ${before === null ? '—' : before} → <b>${after}</b> (${journeyDeltaHtml(e.delta)})`
        + `, reliability ${journeyPct(e.previousReliability)} → ${journeyPct(e.reliability)}.`
        + ` The club judged the original estimate wrong and replaced it. This is a decision, not a result on court.`
      : `Power Rating unchanged at <b>${after}</b>, reliability unchanged at ${journeyPct(e.reliability)}.`
        + ` The starting tier was wrong; the evidence gathered since was not, so none of it was discarded.`;
    return row('Classification corrected', `Initial tier corrected: Tier ${e.previousTier || '—'} → Tier ${e.tier || '—'}`, detail);
  }
  if(e.kind === 'reassessment'){
    const before = e.previousRating === null ? null : Math.round(e.previousRating);
    return row('Club decision', `Club rating reassessment`,
      `Power Rating ${before === null ? '—' : before} → <b>${after}</b> (${journeyDeltaHtml(e.delta)}), reliability ${journeyPct(e.previousReliability)} → ${journeyPct(e.reliability)}. A club decision recorded against ${name}'s record, not a result on court.${e.notes ? ` ${e.notes}` : ''}`);
  }
  if(e.kind === 'match'){
    const d = journeyMatchDescription(name, e.matchId);
    const title = d ? `${d.resultWord} ${d.opponents}${d.partner ? ` (with ${d.partner})` : ''}` : `Match ${e.matchId}`;
    // Deliberately NOT called a share of games. The performance score is
    // 80% games won + 20% the result, so it is a different quantity from the
    // game-share figures on the match cards below and must not borrow their
    // wording -- two near-identical labels on one screen read as a
    // contradiction even when both numbers are right.
    const score = (v) => (v === null || v === undefined) ? '—' : v.toFixed(2);
    return row('Match', title,
      `${journeyDeltaHtml(e.delta)} → <b>${after}</b>. Performance score ${score(e.actual)} against ${score(e.expected)} expected${d && d.score ? ` (${d.score})` : ''}. Weighting K ${Math.round(e.kUsed)} · reliability ${journeyPct(e.previousReliability)} → ${journeyPct(e.reliability)}.`);
  }
  return row('', e.eventType, `Power Rating ${after}.`);
}

const JOURNEY_METHODOLOGY_TEXT = `Every point below is the number the engine recorded at the time, replayed back in order — not a re-estimate. Each match compares what was expected of you before the ball was struck with the performance score you actually delivered. That score runs 0 to 1 and is 80% the share of games you won plus 20% the result itself, so it is deliberately not the same figure as the game percentages shown on the match cards. The gap between expected and delivered is multiplied by a weighting that starts high while your rating is new and falls as evidence builds, so early matches move you further than late ones. A tier change moves no points and no reliability at all. A club reassessment does move points, and is shown as its own event so it can never be mistaken for a result.`;

function buildJourneyLegendHtml(journey){
  const series = JourneyView.chartSeries(journey);
  const bits = [`<span style="color:#5a9c5a;">●</span> match gained · <span style="color:#b5453f;">●</span> match lost ground`];
  // Described by what is actually drawn. Claiming "no rating movement" for a
  // correction that moved the rating by 263 points made the legend contradict
  // the leap in the chart directly above it.
  if(series.some(s=>s.isJump)) bits.push(`<span style="color:#7ba7d4;">◆</span> club decision (moved the rating)`);
  if(series.some(s=>s.isAnnotation)) bits.push(`<span style="color:#c8a96a;">▫</span> tier change (no rating movement)`);
  return `<div style="font-size:10.5px; color:var(--text-dim); margin-top:4px;">${bits.join(' &nbsp;·&nbsp; ')}</div>`;
}

// Shared by the legacy profile sheet and the premium profile so the two can
// never drift into showing different journeys.
// `showHeadline` is false where the caller already prints the start/end figure
// above the body, so the same number is never printed twice.
function buildJourneyBodyHtml(name, journey, showHeadline){
  const start = Math.round(journey.startRating);
  const end = Math.round(journey.endRating);
  const diff = end - start;
  const diffClass = diff > 0 ? 'perf-pos' : (diff < 0 ? 'perf-neg' : '');
  const notable = journey.entries.filter(e => e.kind !== 'match');

  const counts = [`${journey.matchCount} match${journey.matchCount === 1 ? '' : 'es'}`];
  if(journey.tierChangeCount) counts.push(`${journey.tierChangeCount} tier change${journey.tierChangeCount === 1 ? '' : 's'}`);
  if(journey.reassessmentCount) counts.push(`${journey.reassessmentCount} club reassessment${journey.reassessmentCount === 1 ? '' : 's'}`);

  const lead = showHeadline === false
    ? `Across ${counts.join(', ')}`
    : `${start} → <b>${end}</b> <span class="${diffClass}">(${diff >= 0 ? '+' : ''}${diff} pts)</span> across ${counts.join(', ')}`;
  let html = `<div class="section-sub">${lead}, from ${journeyDateLabel(journey.firstDate)} to ${journeyDateLabel(journey.lastDate)}. This is the recorded journey: the last point is the Power Rating.</div>`;
  html += `<div class="matchup-vs" style="padding:8px;">${buildV3JourneyChartSvg(journey)}</div>`;
  html += buildJourneyLegendHtml(journey);

  if(notable.length){
    html += `<div class="section-heading" style="margin-top:12px;">Milestones</div>`;
    html += notable.map(e => buildJourneyEventRowHtml(name, e)).join('');
  }

  html += `<details style="margin-top:10px;"><summary class="explainer-toggle" style="padding-left:0; cursor:pointer;">Every event (${journey.entries.length}) ›</summary>`;
  html += journey.entries.slice().reverse().map(e => buildJourneyEventRowHtml(name, e)).join('');
  html += `</details>`;

  html += `<details style="margin-top:8px;"><summary class="explainer-toggle" style="padding-left:0; cursor:pointer;">How your rating moves ›</summary>
    <div class="section-sub">${JOURNEY_METHODOLOGY_TEXT}</div></details>`;
  return html;
}

// `result` is whatever playerJourney() returned. No silent fallback: a failed
// read says so, and a player with no recorded events says that instead of
// inventing a starting point.
function buildJourneySection(name, result){
  let body;
  if(!result) body = `<div class="section-sub">Rating journey unavailable.</div>`;
  else if(result.error) body = `<div class="section-sub" style="color:var(--red);">Rating journey unavailable — ${result.error} Reload to try again.</div>`;
  else if(result.empty) body = `<div class="section-sub">No rating events recorded for ${name} yet.</div>`;
  else body = buildJourneyBodyHtml(name, result.journey);
  return `<div class="section-heading" style="margin-top:14px;">📈 Rating journey</div>` + body;
}

function buildRecentFormSection(name){
  const form = computeRecentForm(name, 10);
  if(!form || form.games < 3) return ''; // not enough recent data to be meaningful
  const isStale = form.daysSinceLastGame > RECENT_FORM_STALE_DAYS;
  const pct = form.avgPct;
  const cls = isStale ? '' : (pct > 3 ? 'perf-pos' : (pct < -3 ? 'perf-neg' : ''));
  const sign = pct >= 0 ? '+' : '';
  let note;
  if(isStale) note = `hasn't played in a while, so this doesn't reflect current form`;
  else if(pct > 8) note = 'trending up clearly — worth watching for a promotion case';
  else if(pct > 3) note = 'trending up modestly';
  else if(pct < -8) note = 'trending down clearly';
  else if(pct < -3) note = 'trending down modestly';
  else note = 'holding roughly steady';
  const staleWarning = isStale
    ? `<div class="section-sub" style="color:#e8a5a1; margin-top:4px;">⚠️ Last played ${fmtDaysAgo(form.daysSinceLastGame)} — this record is from before then, not a sign of current form.</div>`
    : '';
  return `<div class="section-heading" style="margin-top:14px;">📊 Recent form (last ${form.games} games)</div>
    <div class="matchup-vs" style="${isStale?'opacity:0.7;':''}"><span class="${cls}" style="font-weight:700; font-size:15px;">${sign}${pct}%</span> <span style="color:var(--green); font-weight:700;">${form.wins}W</span>-<span style="color:var(--red); font-weight:700;">${form.losses}L</span> <span style="color:var(--text-dim); font-size:11.5px;">average overperformance vs. expectation — ${note}. This is separate from the overall rating above and moves faster, since it's a short window.</span></div>${staleWarning}`;
}

function buildDevAreasSection(name){
  const notes = devAreasState.filter(a => a.player === name);
  let html = `<div id="devAreasSectionWrap"><div class="section-heading" style="margin-top:14px;">🎯 Development Areas</div>`;
  html += `<div class="section-sub">Freeform notes on what ${name} is working on — anyone can add one.</div>`;
  if(notes.length === 0){
    html += `<div class="section-sub">Nothing added yet.</div>`;
  } else {
    notes.slice().sort((a,b)=> a.addedAt < b.addedAt ? 1 : -1).forEach(note=>{
      const isArmed = armedDeleteId === ('dev_'+note.id);
      html += `<div class="callout-card" style="padding:10px 12px;">
        <div style="font-size:12.5px;">${note.text}</div>
        <div style="margin-top:4px; font-size:10.5px; color:var(--text-dim);">added by ${note.addedBy} (${fmtRelative(note.addedAt)})</div>
        ${isUnlocked ? `<div class="difficulty-row" style="margin-top:6px;"><button class="preset-btn dev-area-delete-btn" data-note-id="${note.id}" style="flex:1; font-size:11px; padding:6px; ${isArmed?'color:#e8a5a1; border-color:var(--red);':''}">${isArmed?'Confirm delete?':'Delete'}</button></div>` : ''}
      </div>`;
    });
  }
  html += `<div class="fg-controls" style="margin-top:6px;">
    <div class="fg-row"><textarea id="devAreaInput" class="fg-select" rows="2" placeholder="e.g. Second serve consistency, moving forward to the net sooner..." style="width:100%; resize:vertical;"></textarea></div>
    <div class="fg-row"><button class="preset-btn" id="devAreaSubmit" style="width:100%;">Add development area</button></div>
    <div id="devAreaMessage" class="section-sub"></div>
  </div></div>`;
  return html;
}

// One player's movement through the selected month: where their real Power
// Rating started and finished, how far it moved, and how their rank moved both
// overall and within their tier. Negative movement is shown exactly like
// positive; a player who sat the month out still gets their boundary state.
function buildMonthlyRatingSection(name){
  if(profileMonth === 'all' || !MONTHLY_VIEWS) return '';
  const label = monthLabel(profileMonth);
  const r = MonthlyViews.playerMonth(MONTHLY_VIEWS, profileMonth, name);
  const p = PLAYERS.find(x=>x.name===name);
  if(!r){
    return `<div class="section-heading" style="margin-top:14px;">📅 ${label}</div>
      <div class="section-sub">${name} has no rating history in ${label}.</div>`;
  }

  const sign = v => (v > 0 ? '+' : '');
  const cls = v => (v > 0 ? 'perf-pos' : (v < 0 ? 'perf-neg' : ''));
  const rankCell = (from, to, change, changed, fromTier, toTier) => {
    if(from === null || to === null) return '<span style="color:var(--text-dim);">not ranked at both ends</span>';
    if(changed) return `#${from} in Tier ${fromTier} → #${to} in Tier ${toTier} <span style="color:var(--text-dim);">— not comparable across a tier change</span>`;
    const arrow = change === 0 ? '' : ` · <span class="${cls(change)}">${change>0?'▲':'▼'}${Math.abs(change)}</span>`;
    return `#${from} → #${to}${arrow}`;
  };

  const row = (k,v) => `<div class="ms-line"><span class="ms-main">${k}</span><span class="ms-sub">${v}</span></div>`;
  const played = r.played
    ? `${r.matches} game${r.matches===1?'':'s'}`
    : '<span style="color:var(--text-dim);">no games — rating unchanged, rank moved around them</span>';

  const perf = (r.performancePct === null)
    ? '<span style="color:var(--text-dim);">n/a — no games</span>'
    : `<span class="${cls(r.monthlyPerformance)}">${sign(r.performancePct)}${r.performancePct}%</span> vs expectation`
      + (r.provisional ? ' <span style="color:var(--text-dim);">(provisional)</span>' : '');

  return `<div class="section-heading" style="margin-top:14px;">📅 ${label}</div>
    <div class="monthly-stories" style="margin:6px 0 0;">
      ${row('Played', played)}
      ${row('Power Rating', `${Math.round(r.startRating)} → ${Math.round(r.endRating)} · <span class="${cls(r.ratingChange)}">${sign(r.ratingChange)}${r.ratingChange} pts</span>`)}
      ${row('Rank overall', rankCell(r.startRankOverall, r.endRankOverall, r.rankChangeOverall, false))}
      ${row('Rank in tier', rankCell(r.startRankInTier, r.endRankInTier, r.rankChangeInTier, r.tierChanged, r.tierAtMonthStart, r.tierAtMonthEnd))}
      ${row('Monthly Performance', perf)}
      <div class="ms-foot">This is the one continuous Power Rating, not a separate monthly score. Today it stands at ${Math.round(p ? p.rating : r.endRating)}.</div>
    </div>`;
}

function computeMonthlyTierStandings(month, tier){
  if(month === 'all') return [];
  const monthlyRatings = monthEndRatings(month);
  const monthly = computeMonthlyStats(month);
  return PLAYERS.filter(p => p.tier === tier)
    .map(p => ({...p, ...(monthly[p.name] || ZERO_MONTH_STATS),
      month_rating: (p.name in monthlyRatings) ? Math.round(monthlyRatings[p.name]*10)/10 : null}))
    .filter(p => p.total >= minGames && p.month_rating !== null && p.month_rating !== undefined)
    .sort((a,b)=> b.month_rating - a.month_rating);
}

// Everything one player+month's breakdown needs, bundled once so the main
// view, "View full calculation", and the Compare view all draw from the
// same numbers rather than risk disagreeing.
function getMonthlyRatingContext(name, month){
  if(month === 'all') return null;
  const p = PLAYERS.find(x=>x.name===name);
  if(!p) return null;
  const tier = TIER_MAP[name] || p.tier;
  const standings = computeMonthlyTierStandings(month, tier);
  const idx = standings.findIndex(s=>s.name===name);
  if(idx === -1) return null; // no qualifying month-end figure for this player
  // No seed here on purpose. A month does not start anyone at a tier baseline;
  // it starts them wherever their continuous rating had reached.
  return {
    name, tier, month,
    player: standings[idx],
    rating: standings[idx].month_rating,
    position: idx+1,
    standings,
    above: idx>0 ? standings[idx-1] : null,
    below: idx<standings.length-1 ? standings[idx+1] : null,
    journey: computeMonthlyJourney(name, month),
  };
}

const MONTHLY_RATING_METHODOLOGY_TEXT = `There is one continuous Power Rating and it never resets. Nothing is solved separately for a month: the month-end figure is simply where that one rating stood on the last day of it — not a separate score solved from that month's games, and not a fresh start from your tier's seed. Each match moves it by how much you beat or fell short of what was expected of you, weighted by how established your rating already is, and the month's figure is wherever that sequence had reached. "Points moved" is the distance travelled during the month, and rank movement is where that left you against everyone else. Monthly Performance answers a different question again: how far above or below pre-match expectation you actually played, regardless of how many rating points that happened to be worth.`;

function buildMonthlyReconciliationText(ctx){
  if(!ctx.journey) return `${ctx.name} has no recorded events in ${monthLabel(ctx.month)}.`;
  const j = ctx.journey;
  const moved = j.totalChange;
  const movedLabel = moved > 0 ? `up ${moved}` : (moved < 0 ? `down ${Math.abs(moved)}` : 'nowhere');
  const extras = [];
  if(j.tierChangeCount) extras.push(`${j.tierChangeCount} tier change${j.tierChangeCount===1?'':'s'} (which move no points)`);
  if(j.reassessmentCount) extras.push(`${j.reassessmentCount} club reassessment${j.reassessmentCount===1?'':'s'}`);
  return `${ctx.name} carried <b style="color:var(--text);">${Math.round(j.startRating)}</b> into ${monthLabel(ctx.month)} — not a tier baseline, but wherever their continuous rating had already reached. Across ${j.matchCount} rated match${j.matchCount===1?'':'es'} (${ctx.player.wins}-${ctx.player.losses})${extras.length ? ` and ${extras.join(' and ')}` : ''} it moved ${movedLabel} to <b style="color:var(--gold-bright);">${Math.round(ctx.rating)}</b>. Every step below is the move the engine recorded at the time; nothing is re-solved for the month.`;
}

function buildMonthlyRatingHeaderHtml(ctx){
  let gapLine, belowLine = '', closeMargin = false;
  if(ctx.position === 1){
    gapLine = ctx.below
      ? `${Math.round(ctx.rating - ctx.below.month_rating)} pt${Math.round(ctx.rating - ctx.below.month_rating)===1?'':'s'} ahead of #2 ${ctx.below.name}`
      : `Only qualifying player in Tier ${ctx.tier} this month`;
    closeMargin = !!ctx.below && Math.abs(ctx.rating - ctx.below.month_rating) < 10;
  } else {
    const gapAbove = Math.round(ctx.above.month_rating - ctx.rating);
    gapLine = `${gapAbove} pt${gapAbove===1?'':'s'} behind #${ctx.position-1} ${ctx.above.name}`;
    if(ctx.below){
      const gapBelow = Math.round(ctx.rating - ctx.below.month_rating);
      belowLine = `${gapBelow} pt${gapBelow===1?'':'s'} ahead of #${ctx.position+1} ${ctx.below.name}`;
    }
  }
  return `<div class="mrb-header">
    <div class="mrb-period">${monthLabel(ctx.month)} · Tier ${ctx.tier}</div>
    <div class="mrb-rankname"><span class="mrb-rank">#${ctx.position}</span> <span class="mrb-name">${ctx.name}</span></div>
    <div class="mrb-rating-row"><span class="mrb-rating">${Math.round(ctx.rating)}</span><span class="mrb-rating-label">Power Rating<br/>at month end</span></div>
    <div class="mrb-gap">${gapLine}</div>
    ${belowLine ? `<div class="mrb-gap mrb-gap-secondary">${belowLine}</div>` : ''}
    ${closeMargin ? `<div class="mrb-close-note">This is a tight one — worth checking the numbers below.</div>` : ''}
  </div>`;
}

// ---- Score orientation ----------------------------------------------------
// Set scores are STORED from the winners' perspective: sets[i][0] is always the
// winning side's games in that set. Printed unchanged on a card that is about
// ONE player, a defeat reads "6-3, 6-4" beside the word LOSS, which looks like
// a win and is the single most confusing thing in the app. Any card written
// from a player's point of view orients the score to that player; a neutral
// card leaves it in winner order and names the winners beside it, so the two
// readings can never be confused.
function setsForViewer(match, viewerWon){
  const sets = match.sets || [];
  return viewerWon ? sets.map(s=>[...s]) : sets.map(([a,b])=>[b,a]);
}

function scoreForViewer(match, viewerWon){
  return setsForViewer(match, viewerWon).map(s=>s.join('-')).join(', ');
}

// True when `name` is on the side the score is stored for. A draw has no
// winner, but it still has a stored side order, and the player's own team is
// still the one their card should read from.
function playerIsOnStoredWinningSide(match, name){
  return (match.winners || []).includes(name);
}

// Who played, with the ratings they carried INTO the match, read from the
// player's own side. Context the explanation above it assumes but does not
// repeat.
function matchLineupHtml(m, name){
  const atTheTime = (n) => (m.deltas && m.deltas[n]) ? Math.round(m.deltas[n].preMatchRating) : ratingOf(n);
  const mine = m.winners.includes(name) ? m.winners : m.losers;
  const theirs = m.winners.includes(name) ? m.losers : m.winners;
  const side = (names) => names.map(n => `${n} (${atTheTime(n)})`).join(' &amp; ');
  return `<b style="color:var(--text);">${side(mine)}</b> vs ${side(theirs)} <span style="font-size:10.5px;">(ratings going in)</span>`;
}

function buildMonthlyMatchCardsHtml(ctx){
  if(!ctx.journey) return `<div class="section-sub">No match data available.</div>`;
  const matchEntries = ctx.journey.entries.filter(e=>e.kind==='match');
  if(matchEntries.length === 0) return `<div class="section-sub">No qualifying matches this month.</div>`;
  return matchEntries.map(e=>{
    const m = MATCHES.find(x=>x.id===e.matchId);
    if(!m) return '';
    const d = journeyMatchDescription(ctx.name, e.matchId);
    const resultLabel = m.isDraw ? `<span style="color:var(--text-dim);">Draw</span>`
      : (d && d.won ? `<span class="perf-pos">Win</span>` : `<span class="perf-neg">Loss</span>`);
    const deltaClass = e.delta > 0 ? 'perf-pos' : (e.delta < 0 ? 'perf-neg' : '');
    return `<div class="callout-card" style="padding:10px 12px;">
      <div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px;">
        <div style="font-size:11.5px; color:var(--text-dim);">${dayLabel(m.date)}</div>
        <div style="font-size:11.5px;">${resultLabel}</div>
      </div>
      <div style="margin-top:2px; font-size:12.5px; font-weight:700;">${scoreForViewer(m, playerIsOnStoredWinningSide(m, ctx.name))}</div>
      <div style="font-size:11.5px; color:var(--text-dim);">${matchLineupHtml(m, ctx.name)}</div>
      <div style="font-size:11.5px; color:var(--text-dim);"><span class="${deltaClass}" style="font-weight:700;">${e.delta > 0 ? '+' : ''}${e.delta} pts</span> for ${ctx.name} → ${Math.round(e.rating)}</div>
      ${whyYourRatingMovedHtml(m, ctx.name)}
      ${matchDeltaLineHtml(m)}
    </div>`;
  }).join('');
}

function buildMonthlyFullCalculationHtml(ctx){
  const exact = ctx.journey ? ctx.journey.endRating : ctx.rating;
  const opened = ctx.journey ? ctx.journey.startRating : null;
  return `<div class="mrb-detail-line">Engine: <b style="color:var(--text);">sequential-v1</b>. Each match is applied once, in order, the moment it is played. Nothing is re-solved and nothing is reset at a month boundary.</div>
    <div class="mrb-detail-line">Per match: the rating moves by K × (performance score − pre-match expected score), where the performance score is 0.80 × games won + 0.20 × the result.</div>
    <div class="mrb-detail-line">K falls as evidence builds: K = 10 + 30 × (1 − reliability), and reliability = e / (e + 10) for e rated matches. A new player moves by up to 40 points a match; a well-established one by around 10.</div>
    ${opened !== null ? `<div class="mrb-detail-line">Carried into ${monthLabel(ctx.month)}: <b style="color:var(--text);">${Math.round(opened*100)/100}</b></div>` : ''}
    <div class="mrb-detail-line">Rating at month end: <b style="color:var(--text);">${Math.round(exact*100)/100}</b> (shown rounded to ${Math.round(ctx.rating)} elsewhere)</div>
    <div class="mrb-detail-line">Qualifying threshold this view uses: ${minGames}+ games this month — the same minimum currently applied to the Power Rankings list, so this can never show a player the list itself wouldn't.</div>`;
}

function buildMonthlyCompareButtonsHtml(ctx){
  const btns = [];
  if(ctx.above) btns.push(`<button class="mp-btn-secondary mrb-compare-btn" data-compare="${ctx.above.name}">Compare with #${ctx.position-1} ${ctx.above.name}</button>`);
  if(ctx.below) btns.push(`<button class="mp-btn-secondary mrb-compare-btn" data-compare="${ctx.below.name}">Compare with #${ctx.position+1} ${ctx.below.name}</button>`);
  if(btns.length === 0) return '';
  return `<div class="mrb-compare-row">${btns.join('')}</div>`;
}

function buildMonthlyRatingBreakdownHtml(name, month){
  const ctx = getMonthlyRatingContext(name, month);
  if(!ctx) return `<div class="section-sub">No qualifying month-end Power Rating for ${name} in ${monthLabel(month)}.</div>`;

  let html = buildMonthlyRatingHeaderHtml(ctx);
  html += `<div class="section-sub" style="margin-top:12px;">${buildMonthlyReconciliationText(ctx)}</div>`;

  if(ctx.journey && ctx.journey.entries.length > 1){
    html += `<div class="section-heading" style="margin-top:14px;">Rating through the month</div>
      <div class="matchup-vs" style="padding:8px;">${buildV3JourneyChartSvg(ctx.journey)}</div>`
      + buildJourneyLegendHtml(ctx.journey);
  }

  const matchCount = ctx.journey ? ctx.journey.matchCount : 0;
  html += `<div class="section-heading" style="margin-top:14px;">Matches this month (${matchCount})</div>`;
  html += buildMonthlyMatchCardsHtml(ctx);

  html += `<button class="explainer-toggle mrb-fullcalc-toggle" id="mrbFullCalcToggle" style="margin-top:10px;">View full calculation ›</button>
    <div class="section-sub" id="mrbFullCalcBody" style="display:none; margin-top:6px;">${buildMonthlyFullCalculationHtml(ctx)}</div>`;

  const compareHtml = buildMonthlyCompareButtonsHtml(ctx);
  if(compareHtml) html += `<div style="margin-top:14px;">${compareHtml}</div>`;

  html += `<button class="explainer-toggle mrb-howitworks-toggle" id="mrbHowItWorksToggle" style="margin-top:14px;">How month-end Power Rating works ›</button>
    <div class="section-sub" id="mrbHowItWorksBody" style="display:none; margin-top:6px;">${MONTHLY_RATING_METHODOLOGY_TEXT}</div>`;

  return html;
}

function buildMonthlyRatingCompareHtml(nameA, nameB, month){
  const ctxA = getMonthlyRatingContext(nameA, month);
  const ctxB = getMonthlyRatingContext(nameB, month);
  if(!ctxA || !ctxB) return `<div class="section-sub">Not enough data to compare.</div>`;
  const diff = Math.round((ctxA.rating - ctxB.rating)*10)/10;
  const leaderCtx = diff >= 0 ? ctxA : ctxB;
  const trailCtx = diff >= 0 ? ctxB : ctxA;
  const margin = Math.abs(diff);

  // Neither player is seeded at a month boundary: they each carry in whatever
  // their continuous rating had reached, and the month's results move it from
  // there. Saying where they came in is what actually explains the gap.
  const openA = ctxA.journey ? Math.round(ctxA.journey.startRating) : null;
  const openB = ctxB.journey ? Math.round(ctxB.journey.startRating) : null;
  const seedLine = (openA === null || openB === null)
    ? `Both figures are month-end points on one continuous rating, not a score solved for ${monthLabel(month)}.`
    : `${ctxA.name} carried ${openA} into ${monthLabel(month)} and ${ctxB.name} carried ${openB}. Neither is reset at the start of a month, so the gap below is that head start plus what each of them did with it.`;

  const statLine = (ctx) => `<b style="color:var(--text);">${ctx.name}</b>: ${ctx.player.wins}-${ctx.player.losses}, avg opponent ${Math.round(ctx.player.avg_match_strength)}, ${ctx.player.avg_overperf_pct>=0?'+':''}${ctx.player.avg_overperf_pct}% vs. expectation`;

  const explainer = margin < 10
    ? `A margin this small usually comes down to a handful of close games — check each player's full match list for the detail.`
    : `${leaderCtx.name}'s edge shows up mainly in ${leaderCtx.player.avg_overperf_pct > trailCtx.player.avg_overperf_pct ? 'outperforming what their results were expected to be' : 'a tougher run of opposition'} this month.`;

  return `<div class="mrb-header">
    <div class="mrb-period">${monthLabel(month)} · Tier ${ctxA.tier}</div>
    <div class="mrb-compare-title">${ctxA.name} vs ${ctxB.name}</div>
  </div>
  <div class="mrb-compare-ratings">
    <div class="mrb-compare-side"><div class="mrb-compare-name">${ctxA.name}</div><div class="mrb-compare-rating">${Math.round(ctxA.rating)}</div><div class="mrb-compare-pos">#${ctxA.position}</div></div>
    <div class="mrb-compare-vs">VS</div>
    <div class="mrb-compare-side"><div class="mrb-compare-name">${ctxB.name}</div><div class="mrb-compare-rating">${Math.round(ctxB.rating)}</div><div class="mrb-compare-pos">#${ctxB.position}</div></div>
  </div>
  <div class="section-sub" style="margin-top:10px;">${leaderCtx.name} leads by ${margin} pt${margin===1?'':'s'}. ${seedLine}</div>
  <div class="section-heading" style="margin-top:14px;">This month, side by side</div>
  <div class="matchup-vs">${statLine(ctxA)}</div>
  <div class="matchup-vs" style="margin-top:6px;">${statLine(ctxB)}</div>
  <div class="section-sub" style="margin-top:8px;">${explainer}</div>`;
}

// The Player Profile's own month. A profile is the player as they are: current
// rating, career record, every result. Narrowing it to one month is something
// the reader asks for, from the profile itself -- it is never inherited.
//
// It lasts for as long as the sheet stays open on the same player, because the
// sheet re-renders itself in place (confirming a delete, clearing a filter) and
// those refreshes must keep the reader's choice. Any other open -- from the
// Directory, from Rankings, from Home, from anywhere -- starts again at
// All time.
let profileMonth = 'all';
let profileMonthFor = null;

// The explicit month control on the profile's results. Lives here so the
// premium profile (shell.js) and anything else that shows a player's results
// draw the same control from the same state.
function profileMonthSelectHtml(){
  const months = getAvailableMonths();
  return `<select id="profileMonthSelect" class="pp-month-select" aria-label="Show results from">
    <option value="all" ${profileMonth==='all'?'selected':''}>All time</option>
    ${months.map(m=>`<option value="${m}" ${m===profileMonth?'selected':''}>${monthLabel(m)}</option>`).join('')}
  </select>`;
}

function wireProfileMonthSelect(name){
  const sel = document.getElementById('profileMonthSelect');
  if(!sel) return;
  sel.onchange = ()=>{
    profileMonth = sel.value;
    openSheet(name);   // an in-place refresh, so the choice is kept
  };
}

function profileSheetIsOpenOn(name){
  const overlay = document.getElementById('overlay');
  return profileMonthFor === name && !!overlay && overlay.classList.contains('show');
}

function openSheet(name, matchFilter){
  if(!profileSheetIsOpenOn(name)) profileMonth = 'all';
  profileMonthFor = name;
  const p = PLAYERS.find(x=>x.name===name);
  document.getElementById('sheetName').textContent = name;
  const riskInfo = RISK_LABELS[p.risk] || RISK_LABELS.stable;
  document.getElementById('sheetSub').innerHTML = `Tier ${p.tier} · Money Padel &nbsp; <span class="risk-badge ${riskInfo.cls}">${riskInfo.text}</span>`;
  document.getElementById('sheetStats').innerHTML = `
    <div><b>${Math.round(p.rating)}</b>Power rating</div>
    <div><b>${p.winpct}%</b>Win rate</div>
    <div><b>${p.wins}-${p.losses}</b>Record</div>
    <div><b>${p.upset_wins}-${p.upset_losses}</b>Upset W-L</div>
  `;
  const journeyResult = playerJourney(name);
  // The rating change shown on each match card is the figure the engine
  // actually applied to THIS player in that match. K is per-player, so two
  // players in the same match move by different amounts; this is their own
  // recorded number, not a team-wide estimate.
  //
  // There is no month-scoped variant any more. The rating is continuous and
  // never resets, so a match moved it by exactly one amount whichever month
  // filter happens to be active.
  const deltaByMatchId = journeyDeltasByMatchId(journeyResult.journey);

  document.getElementById('sheetProfile').innerHTML = `<div class="profile-box">${buildProfileText(p)}</div>` + buildDevAreasSection(name) + buildRecentFormSection(name) + buildMonthlyRatingSection(name) + buildJourneySection(name, journeyResult) + buildRankingNeighborsSection(name) + buildCallOutSection(name) + buildDifficultySection(name);
  // A player's own match log is a record of what they played, so it holds the
  // drawn games too. (The rated set, MATCHES, deliberately does not -- see
  // recomputeAll. Nothing below this line feeds a rating or a ranking.)
  let ms = matchesIncludingDraws().filter(m => m.winners.includes(name) || m.losers.includes(name));
  ms.sort((a,b)=> a.date < b.date ? 1 : -1);

  // Scoped only by the profile's OWN month. This line used to read "if a month
  // is selected elsewhere in the app, keep this profile scoped to it too" --
  // harmless when a person chose that month, and wrong from the day Rankings
  // started choosing August automatically.
  const monthActive = profileMonth !== 'all';
  if(monthActive){
    ms = ms.filter(m => m.date.slice(0,7) === profileMonth);
  }

  let filterBannerHtml = '';
  const upsetFilterActive = matchFilter === 'upset_wins' || matchFilter === 'upset_losses';
  if(upsetFilterActive){
    // Whether a result was an upset is settled by the ratings the two pairings
    // carried INTO the match, which is what team_w_rating/team_l_rating now
    // are. There is no month-specific variant any more: a match was or was not
    // an upset when it was played, and no later month can change that.
    ms = ms.filter(m=>{
      // Neither an upset win nor an upset loss: nobody won it.
      if(MatchOutcome.isDraw(m)) return false;
      const won = m.winners.includes(name);
      const myTeamRating = won ? m.team_w_rating : m.team_l_rating;
      const oppTeamRating = won ? m.team_l_rating : m.team_w_rating;
      const gap = Math.abs(myTeamRating - oppTeamRating);
      const favored = myTeamRating > oppTeamRating;
      if(gap < 15) return false; // must be a genuine gap going in to count as an upset
      return matchFilter === 'upset_wins' ? (won && !favored) : (!won && favored);
    });
  }

  if(monthActive || upsetFilterActive){
    const monthPart = monthActive ? monthLabel(profileMonth) : '';
    const upsetPart = upsetFilterActive ? (matchFilter === 'upset_wins' ? 'upset wins' : 'upset losses') : '';
    let label;
    if(monthActive && upsetFilterActive) label = `${upsetPart} in ${monthPart}`;
    else if(monthActive) label = monthPart;
    else label = upsetPart;
    const clearLabel = upsetFilterActive ? 'show all games' + (monthActive ? ` in ${monthPart}` : '') : '';
    filterBannerHtml = `<div class="section-sub" style="padding:8px 2px;">Showing only ${label} for ${name}${upsetFilterActive ? ` — <span id="clearProfileFilter" style="text-decoration:underline; cursor:pointer; color:var(--gold-bright);">${clearLabel}</span>` : ''}</div>`;
    if(ms.length === 0){
      filterBannerHtml += `<div class="section-sub">No games match this.</div>`;
    }
  }

  const box = document.getElementById('sheetMatches');
  box.innerHTML = filterBannerHtml + ms.map(m=>{
    const sides = MatchOutcome.sidesFor(m, name);
    const drew = sides.outcome === MatchOutcome.DRAW;
    // On a drawn match `winners` is whichever side the record filed first, so
    // it may not be this player's. `sidesFor` picks the side they were
    // actually on, which is the only question that still has an answer.
    const won = sides.outcome === MatchOutcome.WIN;
    const onStoredWinnersSide = m.winners.includes(name);
    const myTeam = sides.mine;
    const oppTeam = sides.theirs;
    const partner = m.type==='doubles' ? sides.partner : null;

    const myTeamRating = onStoredWinnersSide ? m.team_w_rating : m.team_l_rating;
    const oppTeamRating = onStoredWinnersSide ? m.team_l_rating : m.team_w_rating;
    const favored = myTeamRating > oppTeamRating;
    const gap = Math.round(Math.abs(myTeamRating - oppTeamRating));

    const isCloseGoingIn = gap < 15;
    let upsetTag = '';
    if(!isCloseGoingIn && !drew){
      if(favored && !won) upsetTag = `<div class="upset-tag upset-bad">⚠️ UPSET LOSS — lost as the favorite</div>`;
      else if(!favored && won) upsetTag = `<div class="upset-tag upset-good">🔥 UPSET WIN — won as the underdog</div>`;
    }

    // Ratings as they were going into this match, not as they are today.
    const atTheTime = (n) => (m.deltas && m.deltas[n]) ? Math.round(m.deltas[n].preMatchRating) : ratingOf(n);
    const namesWithRatings = myTeam.map(n => `${n} (${atTheTime(n)})`).join(' &amp; ');
    const oppWithRatings = oppTeam.map(n => `${n} (${atTheTime(n)})`).join(' &amp; ');

    const delta = deltaByMatchId[m.id];
    // One place owns correction, so a blast radius is never shown twice or
    // acted on from two screens at once.
    const adminButtons = isUnlocked
      ? `<div class="section-sub" style="margin-top:8px; font-size:10.5px;">To correct or remove this game, open it in the Games tab.</div>`
      : '';

    return `<div class="match" data-match-id="${m.id}">
      <div class="top"><span>${m.date}${m.type==='singles' ? ' · Singles' : ''}</span><span style="color:${drew?'var(--text-dim)':(won?'var(--green)':'var(--red)')}">${drew?'DRAW':(won?'WIN':'LOSS')}</span></div>
      ${upsetTag}
      <div class="teams"><b>${namesWithRatings}</b> vs ${oppWithRatings}</div>
      <div class="score">${scoreForViewer(m, onStoredWinnersSide)}${m.note ? ' · '+m.note : ''}</div>
      ${whyYourRatingMovedHtml(m, name)}
      ${matchDeltaLineHtml(m)}
      ${adminButtons}
    </div>`;
  }).join('');
  document.getElementById('overlay').classList.add('show');

  box.querySelectorAll('.profile-edit-btn').forEach(btn=>{
    btn.onclick = ()=>{
      const id = btn.dataset.matchId;
      closeSheet();
      navigateToGamesTabForEdit(id);
    };
  });
  box.querySelectorAll('.profile-delete-btn').forEach(btn=>{
    btn.onclick = async ()=>{
      const id = btn.dataset.matchId;
      if(armedDeleteId === id){
        await deleteMatch(id);
        openSheet(name); // refresh this sheet with the deletion applied
      } else {
        armedDeleteId = id;
        openSheet(name); // re-render to show "Confirm delete?"
      }
    };
  });

  wireRequestPlayerLinks(document.getElementById('sheetProfile'));

  const clearFilterEl = document.getElementById('clearProfileFilter');
  if(clearFilterEl) clearFilterEl.onclick = ()=> openSheet(name);

  const devSubmitBtn = document.getElementById('devAreaSubmit');
  if(devSubmitBtn){
    devSubmitBtn.onclick = async ()=>{
      const msg = document.getElementById('devAreaMessage');
      const text = document.getElementById('devAreaInput').value.trim();
      if(!text){ msg.textContent = 'Write something first.'; return; }
      const addedBy = requireName();
      if(!addedBy) return;
      const note = { id: 'dev_' + Date.now() + '_' + Math.random().toString(36).slice(2,8), player: name, text, addedBy, addedAt: new Date().toISOString() };
      devAreasState.push(note);
      const ok = await saveDevAreas(devAreasState);
      if(!ok){
        devAreasState.pop();
        msg.textContent = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage.`;
        return;
      }
      openSheet(name);
    };
  }
  document.querySelectorAll('.dev-area-delete-btn').forEach(btn=>{
    btn.onclick = async ()=>{
      const noteId = btn.dataset.noteId;
      const armKey = 'dev_' + noteId;
      if(armedDeleteId === armKey){
        devAreasState = devAreasState.filter(a=>a.id!==noteId);
        await saveDevAreas(devAreasState);
        armedDeleteId = null;
      } else {
        armedDeleteId = armKey;
      }
      openSheet(name);
    };
  });
}

function navigateToGamesTabForEdit(matchId){
  editingMatchId = matchId;
  armedDeleteId = null;
  const gamesTabBtn = document.querySelector('#tabrow .tab-btn[data-tab="games"]');
  if(gamesTabBtn) gamesTabBtn.click();
}

let linkedRequestId = null;

function navigateToGamesTabForResult(req){
  linkedRequestId = req.id;
  addGameExpanded = true;
  editingMatchId = null;
  armedDeleteId = null;
  const gamesTabBtn = document.querySelector('#tabrow .tab-btn[data-tab="games"]');
  if(gamesTabBtn) gamesTabBtn.click();

  const a1 = document.getElementById('agA1');
  if(a1){
    // The sides the game was agreed as, not the order four names happened to
    // be typed in. A singles fixture put through the old flat split would have
    // arrived as a single partnership with nobody to play.
    const [sideA, sideB] = requestTeams(req);
    a1.value = sideA[0] || '';
    document.getElementById('agA2').value = sideA[1] || '';
    document.getElementById('agB1').value = sideB[0] || '';
    document.getElementById('agB2').value = sideB[1] || '';
    const singlesBtn = document.querySelector('#agTypeToggle .fg-toggle-btn[data-type="singles"]');
    if(singlesBtn && sideA.length === 1 && sideB.length === 1) singlesBtn.click();
    if(req.preferredDate){
      const dateEl = document.getElementById('agDate');
      if(dateEl) dateEl.value = req.preferredDate;
    }
    checkForNewPlayers();
    const anchor = document.getElementById('addGameBody');
    if(anchor){ try { anchor.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(e){ /* non-critical */ } }
  }
}
function closeSheet(){ document.getElementById('overlay').classList.remove('show'); }
document.getElementById('overlay').addEventListener('click', e=>{ if(e.target.id==='overlay') closeSheet(); });

// ===================== MANAGE TAB =====================
let addGameSets = [{w:'', l:''}, {w:'', l:''}];

function allPlayerNames(){
  return [...PLAYERS].map(p=>p.name).sort((a,b)=>a.localeCompare(b));
}

// ===================== HISTORICAL CLUB ADJUSTMENT (screen) =====================
// Admin-only. Records a club decision at a date that has already passed: a
// board decision entered late, a factual correction, or the repair of a
// mistake. Separate from historical MATCH correction, which repairs what
// happened on court -- one is a fact about a result, the other a judgement
// about a player's level, and merging them would let a rating be changed under
// cover of fixing a score.
//
// Everything downstream of the date is re-derived, so the blast radius is shown
// in full before anything is written, and nothing earlier is ever deleted.

let histAdj = null;      // the adjustment being composed
let histCtx = null;      // reconstructed state before the chosen date
let histPlan = null;     // the replayed consequence, awaiting confirmation
let histMessage = '';
let histBusy = false;

function histReset(){ histAdj = null; histCtx = null; histPlan = null; histMessage = ''; }

async function histLoadContext(){
  const name = (document.getElementById('histPlayer') || {}).value || '';
  const date = (document.getElementById('histDate') || {}).value || '';
  const player = Object.keys(V3_STATE.players || {}).find(n => n.toLowerCase() === name.trim().toLowerCase());
  if(!player){ histMessage = name ? `No v3 record for "${name}".` : 'Enter a player name.'; renderManage(); return; }
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){ histMessage = 'Enter an effective date as YYYY-MM-DD.'; renderManage(); return; }

  histAdj = { playerId: playerIdFor(player), effectiveDate: date, tierEvent: null, newTier: null,
    ratingDecision: null, overrideRating: null, overrideReliability: null, reliabilityChoice: null,
    correctedRating: null, correctedReliability: null, reason: '', createdBy: reviewActor() };
  histPlan = null; histMessage = '';
  try {
    histCtx = HistoricalAdjustment.context({ journey: (V3_RECORD && V3_RECORD.journey) || [], playerId: playerIdFor(player), effectiveDate: date, toTier: null });
  } catch(e){ histCtx = null; histMessage = e.message; }
  renderManage();
}

// Folds whatever is typed into the open fields into the draft. A field that is
// not on screen keeps whatever the draft already holds -- reading a missing
// input as empty would silently erase a value the moment the panel re-rendered
// without it.
function histDraft(){
  if(!histAdj) return null;
  const el = (id) => document.getElementById(id);
  const num = (id, fallback) => { const e = el(id); if(!e) return fallback;
    const v = e.value.trim(); return (v === '' || !isFinite(Number(v))) ? null : Number(v); };
  const pct = (id, fallback) => { const e = el(id); if(!e) return fallback;
    const v = e.value.trim(); return (v === '' || !isFinite(Number(v))) ? null : Number(v) / 100; };
  const text = (id, fallback) => { const e = el(id); return e ? e.value.trim() : fallback; };
  return {
    ...histAdj,
    overrideRating: num('histOverrideRating', histAdj.overrideRating),
    overrideReliability: pct('histOverrideRel', histAdj.overrideReliability),
    correctedRating: num('histCorrectedRating', histAdj.correctedRating),
    correctedReliability: pct('histCorrectedRel', histAdj.correctedReliability),
    reason: text('histReason', histAdj.reason) || histAdj.reason,
    createdBy: reviewActor(),
  };
}

// Reconstructs the context for the chosen tier so the recommendation is drawn
// from that historical date -- never from today's pools.
function histRefreshContext(toTier){
  histCtx = HistoricalAdjustment.context({
    journey: (V3_RECORD && V3_RECORD.journey) || [], playerId: histAdj.playerId,
    effectiveDate: histAdj.effectiveDate, toTier,
  });
}

async function histPreview(){
  histAdj = histDraft();
  histBusy = true; histMessage = 'Replaying…'; renderManage();
  try {
    const backend = RatingStore.firestoreCompatBackend(db);
    const stored = await readStoredRecord(backend);
    histPlan = HistoricalAdjustment.plan({
      stored, adjustment: histAdj,
      provenance: { createdBy: histAdj.createdBy, recordedAt: new Date().toISOString(), source: 'Historical Club Adjustment' },
    });
    histMessage = '';
  } catch(e){
    histPlan = null;
    histMessage = e.message;
  }
  histBusy = false;
  renderManage();
}

async function histCommit(){
  if(!histPlan) return;
  histBusy = true; histMessage = 'Writing…'; renderManage();
  try {
    await ReplayForward.commit(RatingStore.firestoreCompatBackend(db), histPlan);
    const summary = histPlan.summary;
    histReset();
    await loadV3State();
    histMessage = 'Recorded and replayed. ' + summary;
  } catch(e){
    histMessage = 'Write failed: ' + e.message;
  }
  histBusy = false;
  // Admin is the screen this was done from, so redrawing the active screen
  // shows the outcome message; everything derived from the record this has
  // just rewritten is rebuilt with it.
  dataChanged();
}

function buildHistoricalAdjustmentHtml(){
  // The accordion header names this section; repeating it here said it twice.
  let html = '';
  if(!V3_STATE.loaded){
    return html + `<div class="section-sub" style="color:var(--red);">Unavailable — the record could not be read.</div>`;
  }
  html += `<div class="section-sub">For a board decision entered late, a factual correction, or repairing a mistake. This is <b>not</b> for fixing a match result — that changes what happened on court, this records what the club decided about a player's level. Everything after the date is re-derived, nothing earlier is ever deleted, and you see the full consequence before anything is written.</div>`;

  if(histMessage) html += `<div class="section-sub" style="color:${/failed|cannot|No v3|Enter an/.test(histMessage)?'var(--red)':'var(--gold-bright)'};">${histMessage.replace(/\n/g,'<br/>')}</div>`;

  html += `<div class="fg-controls">
    <div class="fg-row"><label class="fg-label">Player</label><input id="histPlayer" list="playerNamesList" class="fg-select" value="${histAdj ? histAdj.playerId : ''}" placeholder="Player name" /></div>
    <div class="fg-row"><label class="fg-label">Effective date</label><input id="histDate" class="fg-select" value="${histAdj ? histAdj.effectiveDate : ''}" placeholder="YYYY-MM-DD" /></div>
    <div class="fg-row"><button class="preset-btn" id="histLoadBtn" ${histBusy?'disabled':''}>Reconstruct that date</button></div>
  </div>`;

  if(!histAdj || !histCtx) return html;

  const b = histCtx.before;
  if(!b) return html + `<div class="section-sub" style="color:var(--red);">${histAdj.playerId} has no recorded state before ${histAdj.effectiveDate}.</div>`;

  html += `<div class="callout-card" style="padding:12px; margin-top:8px;">
    <div style="font-weight:700; color:var(--text);">${histAdj.playerId} immediately before ${histAdj.effectiveDate}</div>
    <div class="section-sub" style="margin-top:2px;">Tier ${b.tier} · Power Rating <b style="color:var(--text);">${(Math.round(b.rating*10)/10).toFixed(1)}</b> · Reliability ${Math.round(Engine_reliability(b.effectiveEvidence)*100)}% (${b.effectiveEvidence} evidence, ${b.lifetimeMatches} matches) · ${b.classificationStatus || 'status unknown'}</div>
    <div class="section-sub" style="font-size:10.5px;">Last event before that date: ${b.asOfDate}. Measured against the ${histCtx.snapshotSize} players who had a record by then, not today's.</div>`;

  if(histCtx.existing.length){
    html += `<div class="section-sub" style="margin-top:6px; font-weight:700; color:var(--text);">Already recorded on this date</div>`;
    html += histCtx.existing.map(e=>buildAuditRowHtml(e, histCtx.existing)).join('');
    html += `<div class="section-sub" style="font-size:10.5px;">A decision of the same type will <b>supersede</b> the live one above. Both stay in the record; only the newer is replayed.</div>`;
  }

  // Tier
  const up = TIER_ABOVE[b.tier], down = TIER_BELOW[b.tier];
  html += `<div class="section-heading" style="margin-top:12px;">1 · Tier as at ${histAdj.effectiveDate}</div>
    <div class="difficulty-row" style="margin-top:4px;">
      ${up ? `<button class="preset-btn hist-tier ${histAdj.tierEvent==='PROMOTION'?'active':''}" data-event="PROMOTION" data-tier="${up}" style="flex:1;">Promote to ${up}</button>` : ''}
      ${down ? `<button class="preset-btn hist-tier ${histAdj.tierEvent==='DEMOTION'?'active':''}" data-event="DEMOTION" data-tier="${down}" style="flex:1;">Demote to ${down}</button>` : ''}
      <button class="preset-btn hist-tier ${histAdj.tierEvent==='TIER_RETAINED'?'active':''}" data-event="TIER_RETAINED" data-tier="${b.tier}" style="flex:1;">Retain ${b.tier}</button>
    </div>`;

  if(histAdj.tierEvent){
    const rec = histCtx.recommendation;
    html += `<div class="section-heading" style="margin-top:12px;">2 · Rating decision — required</div>`;
    if(histCtx.recommendationAbsent){
      html += `<div class="section-sub" style="color:var(--gold-bright);">No statistical recommendation is available at this date: ${histCtx.recommendationAbsentReason}</div>`;
      html += `<div class="section-sub" style="font-size:10.5px;">That is an absence, not an answer. It does not mean the board decided to keep the rating — choose keep-current or an override deliberately.</div>`;
    } else if(rec && rec.recommended){
      html += `<div class="section-sub">Recommendation at this date: <b style="color:var(--text);">${(Math.round(rec.recommendationRating*10)/10).toFixed(1)}</b> (${rec.ratingDelta>=0?'+':''}${Math.round(rec.ratingDelta*10)/10}). ${rec.reason}</div>`;
    }

    // Same rule as the live review: an unavailable branch is disabled and says
    // why, rather than offering a button that cannot do anything.
    const opt = (key, label, enabled, why) => `<div class="alpha-row${enabled ? '' : ' row-unavailable'}">
      <div class="alpha-name" style="font-size:12.5px;">${label}${why?`<div style="font-size:10px; color:var(--text-dim);">${why}</div>`:''}</div>
      <button class="preset-btn hist-decision ${histAdj.ratingDecision===key?'active':''}" data-decision="${key}" style="width:104px;" ${enabled?'':'disabled'}>${enabled ? (histAdj.ratingDecision===key?'Chosen':'Choose') : 'Unavailable'}</button>
    </div>${enabled || !why ? '' : `<div class="reason-note">ⓘ ${why}</div>`}`;
    const canAccept = !!(rec && rec.recommended);
    const provisional = b.classificationStatus === 'PROVISIONAL';
    html += opt('ACCEPT_RECOMMENDATION', 'Accept the statistical recommendation', canAccept, canAccept ? '' : 'No recommendation exists at this date. That is an absence, not a decision to keep the rating.');
    html += opt('CLUB_OVERRIDE', 'Club override', true, 'The board sets the rating and/or reliability');
    html += opt('KEEP_CURRENT_RATING', 'Keep the rating as it stood', true, 'An explicit decision, recorded as one');
    html += opt('CORRECT_INITIAL_CLASSIFICATION', 'Correct the initial classification', provisional,
      provisional ? 'The initial estimate was wrong' : `${histAdj.playerId} was already established by this date`);

    if(histAdj.ratingDecision === 'CLUB_OVERRIDE'){
      html += `<div class="fg-controls" style="margin-top:6px;">
        <div class="fg-row"><label class="fg-label">Power Rating</label><input id="histOverrideRating" class="fg-select" value="${histAdj.overrideRating ?? ''}" placeholder="leave blank to keep ${(Math.round(b.rating*10)/10).toFixed(1)}" /></div>
        <div class="fg-row"><label class="fg-label">Reliability %</label><input id="histOverrideRel" class="fg-select" value="${histAdj.overrideReliability!=null?Math.round(histAdj.overrideReliability*100):''}" placeholder="leave blank to keep ${Math.round(Engine_reliability(b.effectiveEvidence)*100)}%" /></div>
      </div>`;
    }
    if(histAdj.ratingDecision === 'CORRECT_INITIAL_CLASSIFICATION'){
      html += `<div class="fg-controls" style="margin-top:6px;">
        <div class="fg-row"><label class="fg-label">Corrected Power Rating</label><input id="histCorrectedRating" class="fg-select" value="${histAdj.correctedRating ?? ''}" placeholder="the rating the club believes was right" /></div>
        <div class="fg-row"><label class="fg-label">Reliability % (optional)</label><input id="histCorrectedRel" class="fg-select" value="${histAdj.correctedReliability!=null?Math.round(histAdj.correctedReliability*100):''}" placeholder="leave blank to keep the evidence earned" /></div>
      </div>`;
    }

    html += `<div class="fg-controls" style="margin-top:6px;">
      <div class="fg-row"><label class="fg-label">Reason — required</label><input id="histReason" class="fg-select" value="${histAdj.reason || ''}" placeholder="Why this is being recorded now" /></div>
    </div>`;
    html += `<div class="section-sub" style="font-size:10.5px;">Recorded as ${reviewActor()}.</div>`;

    html += `<div class="difficulty-row" style="margin-top:8px;">
      <button class="preset-btn" id="histPreviewBtn" style="flex:1;" ${histBusy?'disabled':''}>Preview the full consequence</button>
      <button class="preset-btn" id="histCancelBtn" style="flex:1;">Cancel</button>
    </div>`;
  }
  html += `</div>`;

  if(histPlan) html += buildHistPlanHtml();
  return html;
}

function buildHistPlanHtml(){
  const p = histPlan;
  const moved = p.playersMoved;
  return `<div class="callout-card" style="padding:12px; margin-top:10px; border-color:var(--gold-dim);">
    <div style="font-weight:700; color:var(--gold-bright);">Confirm — this rewrites every rating after ${histAdj.effectiveDate}</div>
    <div class="section-sub" style="margin-top:4px; color:var(--text);">${p.summary}</div>
    <div class="section-sub" style="font-size:10.5px;">${p.events.map(e=>`${e.eventType}${e.supersedes?` (supersedes <code>${e.supersedes}</code>, revision ${e.revision})`:''}`).join('; ')}. ${p.documentsToWrite} documents rewritten, ${p.documentsToDelete} removed.</div>
    <div class="section-sub" style="margin-top:6px; font-weight:700; color:var(--text);">${moved.length} player${moved.length===1?'':'s'} end on a different rating</div>
    <div class="section-sub" style="font-size:10.5px; max-height:180px; overflow:auto;">${moved.map(m=>`${m.playerId} ${m.delta>0?'+':''}${m.delta} → ${Math.round(m.to*10)/10}`).join(' &nbsp;·&nbsp; ')}</div>
    <div class="difficulty-row" style="margin-top:8px;">
      <button class="preset-btn" id="histCommitBtn" style="flex:1;" ${histBusy?'disabled':''}>Record and replay</button>
      <button class="preset-btn" id="histAbandonBtn" style="flex:1;">Cancel</button>
    </div>
  </div>`;
}

function wireHistoricalAdjustment(){
  const load = document.getElementById('histLoadBtn');
  if(load) load.onclick = histLoadContext;
  const cancel = document.getElementById('histCancelBtn');
  if(cancel) cancel.onclick = ()=>{ histReset(); renderManage(); };
  const abandon = document.getElementById('histAbandonBtn');
  if(abandon) abandon.onclick = ()=>{ histPlan = null; histMessage = 'Cancelled — nothing was written.'; renderManage(); };

  document.querySelectorAll('.hist-tier').forEach(el=>{
    el.onclick = ()=>{
      histAdj = { ...histDraft(), tierEvent: el.dataset.event, newTier: el.dataset.tier, ratingDecision: null };
      histPlan = null; histMessage = '';
      histRefreshContext(el.dataset.tier);
      renderManage();
    };
  });
  document.querySelectorAll('.hist-decision').forEach(el=>{
    el.onclick = ()=>{
      if(el.disabled) return; // an unavailable branch is never recordable
      histAdj = { ...histDraft(), ratingDecision: el.dataset.decision };
      histPlan = null; histMessage = '';
      renderManage();
    };
  });
  const prev = document.getElementById('histPreviewBtn');
  if(prev) prev.onclick = histPreview;
  const commit = document.getElementById('histCommitBtn');
  if(commit) commit.onclick = histCommit;
}

// ===================== BETA DIAGNOSTICS (screen) =====================
// Reads the three collections itself, on demand, and checks them against each
// other and against what the application is currently showing. Deliberately not
// part of page load: it is a full read of the database, which is exactly the
// cost the read-strategy exception is trying to avoid paying per render.
//
// Read-only. It reports and never repairs — a diagnostic that quietly fixed
// things would destroy the evidence of what went wrong. The one destructive
// operation, the beta reset, lives in scripts/reset-beta.js and cannot be
// triggered from here.

let diagnosticsReport = null;
let diagnosticsRunning = false;
let diagnosticsError = '';
let diagnosticsRanAt = null;

async function runBetaDiagnostics(){
  if(!db){ diagnosticsError = 'No database connection.'; renderManage(); return; }
  diagnosticsRunning = true; diagnosticsError = ''; renderManage();
  const started = Date.now();
  try {
    const backend = RatingStore.firestoreCompatBackend(db);
    const [playerDocs, matchDocs, journeyDocs] = await Promise.all([
      backend.getAll(RatingStore.COLLECTIONS.players),
      backend.getAll(RatingStore.COLLECTIONS.matches),
      backend.getAll(RatingStore.COLLECTIONS.journey),
    ]);
    const players = {};
    playerDocs.forEach(d => { if(d && d.id) players[d.id] = d; });
    diagnosticsReport = BetaDiagnostics.run({
      players, matches: matchDocs, journey: journeyDocs,
      // Compared against, not used as input: if the app's copy disagrees with
      // the database, that is itself the finding.
      appPlayers: V3_STATE.loaded ? V3_STATE.players : null,
      loadMs: Date.now() - started,
      matchesPerMonth: estimateMatchesPerMonth(),
    });
    diagnosticsRanAt = new Date().toLocaleTimeString();
  } catch(e){
    diagnosticsReport = null;
    diagnosticsError = 'Diagnostics could not read the database: ' + e.message;
  }
  diagnosticsRunning = false;
  renderManage();
}

// Recent months only: the club's rate now is a better guide to growth than an
// average that includes the months before everyone was playing.
function estimateMatchesPerMonth(){
  if(!MONTHLY_VIEWS || !MONTHLY_VIEWS.months.length) return null;
  const months = MONTHLY_VIEWS.months.slice(-3);
  const counts = months.map(m => {
    const rows = MONTHLY_VIEWS.byMonth[m].rows;
    // Each match produces an event per player; rows carry per-player counts.
    return rows.reduce((s, r) => s + r.matches, 0) / 4;
  });
  return counts.length ? Math.round(counts.reduce((a,b)=>a+b,0) / counts.length) : null;
}

// A divergence found this session, shown where an admin would look for it.
// The board is told the record needs repair and that editing is paused; the
// detail goes to the owner, who is the one who can do anything about it.
function buildRecordHealthHtml(){
  if(!healthReport) return '';
  const owner = isOwnerAdmin();
  const message = recordHealthMessage();
  return `<div class="callout-card" style="padding:12px; margin-top:8px; border-color:var(--red);">
    <div style="font-weight:700; color:#e8a5a1;">The record needs repair</div>
    <div class="section-sub" style="margin-top:4px; color:var(--text);">${message}</div>
    ${owner ? `<div class="section-sub" style="font-size:10.5px; margin-top:6px;">
      Logged as <code>${healthReport.id}</code> · first seen ${String(healthReport.firstSeenAt).slice(0,10)}
      · seen ${healthReport.seenCount} time${healthReport.seenCount===1?'':'s'}${(healthReport.seenBy||[]).length ? ' by ' + healthReport.seenBy.join(', ') : ''}.
      No match has been changed or lost: the matches are the record, and only the numbers derived from them are behind.
      Repairing it replays the stored matches and rewrites those numbers — run by Claude Code, who shows the full plan before anything is written.
    </div>` : ''}
  </div>`;
}

function buildDiagnosticsSectionHtml(){
  let html = '';
  html += buildRecordHealthHtml();
  html += `<div class="section-sub">Reads the three collections straight from the database and checks whether the record still hangs together — every rating is the end of a recorded chain, and nothing else in the app would notice if one had a gap. Read-only, and run on demand rather than at page load, because it reads everything.</div>`;
  html += `<div class="fg-controls"><div class="fg-row">
    <button class="preset-btn" id="runDiagnosticsBtn" style="width:100%;" ${diagnosticsRunning?'disabled':''}>${diagnosticsRunning ? 'Reading…' : 'Run diagnostics'}</button>
  </div></div>`;

  if(diagnosticsError) html += `<div class="section-sub" style="color:var(--red);">${diagnosticsError}</div>`;
  if(!diagnosticsReport) return html;

  const r = diagnosticsReport;
  const headline = r.healthy
    ? (r.warned ? `<span class="perf-pos">Record is sound</span> — ${r.warned} thing${r.warned===1?'':'s'} worth a look`
                : `<span class="perf-pos">Record is sound</span> — every check passed`)
    : `<span class="perf-neg">${r.failed} check${r.failed===1?'':'s'} failed</span> — a rating on screen is not explained by the history behind it`;
  html += `<div class="section-sub" style="margin-top:6px;">${headline}. ${r.counts.players} players · ${r.counts.matches} matches · ${r.counts.journey} journey events. Run at ${diagnosticsRanAt}.</div>`;

  html += r.checks.map(c=>{
    const mark = c.status === 'ok' ? '<span class="perf-pos">✔</span>'
      : (c.status === 'warn' ? '<span style="color:var(--gold-bright);">!</span>' : '<span class="perf-neg">✘</span>');
    const items = (c.items && c.items.length)
      ? `<div style="font-size:10.5px; color:var(--text-dim); margin-top:3px;">${c.items.map(i=>`• ${i}`).join('<br/>')}</div>`
      : '';
    return `<div class="matchup-vs" style="margin-top:6px; padding:8px;">
      <div style="font-size:12px;">${mark} <b style="color:var(--text);">${c.name}</b></div>
      <div style="font-size:11px; color:var(--text-dim);">${c.detail}</div>
      ${items}
    </div>`;
  }).join('');

  // The measurement Open Question 1a asks Claude Code to record before the
  // once-per-session cumulative read is allowed to become permanent.
  const rs = r.readStrategy;
  html += `<div class="section-heading" style="margin-top:12px;">Read strategy</div>`;
  html += `<div class="section-sub">Ranking Movement reads the whole journey once per session, by agreed exception while it stays small. This is the measurement that decides when that has to change.</div>`;
  html += `<div class="matchup-vs" style="padding:8px;">
    <div>Journey events: <b style="color:var(--text);">${rs.events}</b> — that is the documents read per session.</div>
    <div>This read took ${rs.loadMs === null ? '—' : rs.loadMs + ' ms'}.</div>
    <div>Growing by roughly ${rs.growthPerMonth === null ? '—' : rs.growthPerMonth} events a month.</div>
    <div style="margin-top:4px;">${rs.due
      ? `<span class="perf-neg">Review is due.</span> Record these figures in PROJECT_LEDGER.md and propose a bounded strategy before relying on this read further.`
      : `Review point is ${rs.reviewAt} events${rs.monthsUntilReview === null ? '' : `, about ${rs.monthsUntilReview} month${rs.monthsUntilReview===1?'':'s'} away`}. Not a limit — the point at which someone should choose deliberately rather than drift.`}</div>
  </div>`;

  html += `<div class="section-heading" style="margin-top:12px;">Beta reset</div>`;
  html += `<div class="section-sub">Returning the beta to its seeded baseline deletes every club decision ever recorded, and cannot be undone from inside the app — the record is forward-only and has no delete. It is deliberately not a button: run <code>node scripts/reset-beta.js</code> for a dry run that lists exactly what would go, then <code>--write --i-mean-it</code> to apply it.</div>`;
  return html;
}

// ===================== ADMIN MONTHLY REVIEW =====================
// The club's decision surface, and the only place the application writes a
// rating. Everything it can do goes through ClubDecision.prepare(), which
// refuses anything that would leave the stored ratings not following from the
// stored history -- so this screen shapes the request and shows exactly what
// will be written, and never decides whether it is allowed.
//
// TRUST MODEL, stated plainly: `isUnlocked` is a UI gate, not a security
// boundary. Beta Firestore has open rules and no auth by deliberate decision,
// so anyone who can reach the database can write to it regardless of this
// screen. What makes a decision safe here is that it is forward-only, fully
// attributed, and undone by recording a reversal rather than by deleting
// anything.

let reviewSubject = null;      // player currently being reviewed
let reviewDraft = null;        // the half-made decision on screen
let reviewSnapshotCache = null; // one pre-review snapshot per effective date

// ---- Audit row ------------------------------------------------------------
// The raw record is truthful but unreadable: "CLUB_RATING_REASSESSMENT — B→B"
// tells a board member nothing, and three promotion rows in a column give no
// clue which one the engine actually replays. This says what each event is, in
// English, and marks the one that is live. It never collapses the trail into a
// single rewritten event -- every row stays, superseded ones just recede.
const AUDIT_EVENT_LABELS = {
  PLAYER_INITIALISED: 'Entered the record',
  INITIAL_CLASSIFICATION_CORRECTION: 'Initial classification corrected',
  INITIAL_CLASSIFICATION_CONFIRMED: 'Initial classification confirmed',
  PROMOTION: 'Promotion',
  DEMOTION: 'Demotion',
  TIER_RETAINED: 'Tier retained',
  CLUB_RATING_REASSESSMENT: 'Rating reassessment',
};

function auditEventLabel(e, siblings){
  const base = AUDIT_EVENT_LABELS[e.eventType] || e.eventType;
  if(e.eventType !== 'CLUB_RATING_REASSESSMENT') return base;
  // A reassessment recorded alongside a tier move is the rating half of one
  // board decision, and saying so is the difference between "why is this here"
  // and "of course".
  const live = (siblings || []).filter(x => !x.superseded);
  if(live.some(x => x.eventType === 'PROMOTION')) return base + ' after promotion';
  if(live.some(x => x.eventType === 'DEMOTION')) return base + ' after demotion';
  return base;
}

function auditTierText(e){
  if(!e.previousTier && !e.newTier) return '';
  if(e.previousTier && e.newTier && e.previousTier === e.newTier) return `tier unchanged (${e.newTier})`;
  return `${e.previousTier || '—'} → <b>${e.newTier || '—'}</b>`;
}

function auditRatingText(e){
  const fmt = (v) => v == null ? '—' : (Math.round(v*10)/10).toFixed(1);
  if(e.previousPowerRating == null && e.newPowerRating == null) return '';
  if(e.previousPowerRating != null && e.newPowerRating != null
     && Math.abs(e.previousPowerRating - e.newPowerRating) < 0.05){
    return `rating unchanged at ${fmt(e.newPowerRating)}`;
  }
  return `rating ${fmt(e.previousPowerRating)} → <b>${fmt(e.newPowerRating)}</b>`;
}

function buildAuditRowHtml(e, siblings){
  const isCorrection = e.eventType === 'INITIAL_CLASSIFICATION_CORRECTION';
  const badge = e.superseded
    ? '<span class="audit-badge audit-badge-superseded">Superseded</span>'
    : (isCorrection
      ? '<span class="audit-badge audit-badge-correction">Correction</span>'
      : '<span class="audit-badge audit-badge-active">Active</span>');
  const facts = [auditTierText(e), auditRatingText(e)].filter(Boolean).join(', ');
  return `<div class="audit-row${e.superseded ? ' audit-row-superseded' : ''}">
    <span class="audit-dot"></span>
    <div class="audit-body">
      <div class="audit-head">${auditEventLabel(e, siblings)}${badge}</div>
      ${facts ? `<div class="audit-facts">${facts}</div>` : ''}
      <div class="audit-meta">by ${e.createdBy || 'unknown'}${e.revision ? ` · revision ${e.revision}` : ''}</div>
    </div>
  </div>`;
}

function Engine_reliability(evidence){ return RatingEngine.reliability(evidence); }

// One snapshot for the whole review date. Every recommendation offered today
// comes from it, so accepting one player's decision cannot move the boundary
// used to recommend the next. Without this, reviewing Jams before Aubyn does
// not merely shift Aubyn's number -- it can empty Tier C below the minimum pool
// size and remove his recommendation altogether.
function reviewSnapshot(){
  const date = reviewToday();
  if(!reviewSnapshotCache || reviewSnapshotCache.date !== date){
    reviewSnapshotCache = { date, state: MonthlyReview.preReviewSnapshot((V3_RECORD && V3_RECORD.journey) || [], date) };
  }
  return reviewSnapshotCache.state;
}

// The draft in the shape MonthlyReview validates, with whatever the board has
// typed into the open fields folded in.
function reviewDraftForCheck(){
  if(!reviewDraft) return { playerId: reviewSubject, effectiveDate: reviewToday() };
  // A field that is not on screen keeps whatever the draft already holds.
  const el = (id) => document.getElementById(id);
  const num = (id, fallback) => { const e = el(id); if(!e) return fallback;
    const v = e.value.trim(); return (v === '' || !isFinite(Number(v))) ? null : Number(v); };
  const pct = (id, fallback) => { const e = el(id); if(!e) return fallback;
    const v = e.value.trim(); return (v === '' || !isFinite(Number(v))) ? null : Number(v) / 100; };
  const text = (id, fallback) => { const e = el(id); return e ? e.value.trim() : fallback; };
  return {
    ...reviewDraft,
    overrideRating: num('reviewOverrideRating', reviewDraft.overrideRating),
    // Two inputs can carry a Reliability override: the club-override block in
    // step 2 (which predates step 3) and step 3's own field. Whichever is on
    // screen wins; neither silently overwrites the other with a blank.
    overrideReliability: pct('reviewRelOverride', pct('reviewOverrideRel', reviewDraft.overrideReliability)),
    correctedRating: num('reviewCorrectedRating', reviewDraft.correctedRating),
    correctedReliability: pct('reviewCorrectedRel', reviewDraft.correctedReliability),
    notes: text('reviewNote', reviewDraft.notes) || reviewDraft.notes || null,
    createdBy: reviewActor(),
    // This screen asks the Reliability question, so it insists on an answer.
    requireReliabilityAnswer: true,
  };
}
let reviewPending = null;      // a prepared decision awaiting explicit confirmation
let reviewMessage = '';

const TIER_ABOVE = { C: 'B', B: 'A', A: 'S' };
const TIER_BELOW = { S: 'A', A: 'B', B: 'C' };

function reviewToday(){ return new Date().toISOString().slice(0,10); }

// Candidates are the players the ratings themselves put near a boundary. It is
// a prompt for a human look, never a queue of things to approve.
function reviewCandidates(){
  if(!V3_STATE.loaded) return [];
  return PLAYERS
    .filter(p => p.risk === 'promotion_watch' || p.risk === 'demotion_watch')
    .map(p => ({
      name: p.name,
      risk: p.risk,
      fromTier: p.tier,
      toTier: p.risk === 'promotion_watch' ? TIER_ABOVE[p.tier] : TIER_BELOW[p.tier],
      gap: p.risk === 'promotion_watch' ? p.promotion_gap : p.demotion_gap,
    }))
    .filter(c => !!c.toTier)
    .sort((a,b)=> (a.gap ?? 1e9) - (b.gap ?? 1e9));
}

function reviewRecommendation(subject, fromTier, toTier, eventType){
  try {
    return Reassessment.getRecommendation({
      state: V3_STATE.players,
      tierOf: (n) => (V3_STATE.players[n] || {}).tier,
      subject, fromTier, toTier, eventType,
    });
  } catch(e){
    return { error: e.message };
  }
}

function buildReviewSectionHtml(){
  let html = '';
  if(!V3_STATE.loaded){
    return html + `<div class="section-sub" style="color:var(--red);">Unavailable — ${String(V3_STATE.error || 'v3 state is not loaded.')} Nothing can be recorded until the record can be read.</div>`;
  }
  html += `<div class="section-sub">Where the club changes a rating or a tier. Every decision is recorded against the player with who made it and what the recommendation said, takes effect from today forward, and is undone by recording a reversal — never by deleting it. A tier move and a rating change are separate decisions on purpose: a promotion awards no points.</div>`;
  html += `<div class="section-sub" style="font-size:10.5px;">The admin unlock controls what this screen shows, not who can write. Beta storage is deliberately open, so treat attribution as a record of intent, not proof of identity.</div>`;

  if(reviewMessage) html += `<div class="section-sub" style="color:var(--gold-bright);">${reviewMessage}</div>`;

  const cands = reviewCandidates();
  html += `<div class="section-sub" style="margin-top:8px; font-weight:700; color:var(--text);">Near a tier boundary (${cands.length})</div>`;
  if(cands.length === 0){
    html += `<div class="section-sub">Nobody is close enough to a boundary to flag. Any player can still be reviewed below.</div>`;
  } else {
    html += cands.map(c=>`<div class="alpha-row">
      <div class="alpha-name" style="font-size:13px;">${c.name} <span style="color:var(--text-dim); font-size:11px;">Tier ${c.fromTier} → ${c.toTier}, ${c.gap === null ? 'gap unknown' : `${Math.abs(c.gap)} pts away`}</span></div>
      <button class="preset-btn review-pick" data-player="${c.name}" style="width:96px;">Review</button>
    </div>`).join('');
  }

  html += `<div class="fg-controls" style="margin-top:8px;">
    <div class="fg-row"><label class="fg-label">Review anyone</label>
      <input id="reviewAnyName" list="playerNamesList" class="fg-select" placeholder="Player name" />
    </div>
    <div class="fg-row"><button class="preset-btn" id="reviewAnyBtn">Open review</button></div>
  </div>`;

  if(reviewSubject) html += buildReviewPanelHtml(reviewSubject);
  return html;
}

// A tier change and its rating consequence are ONE board decision, so the panel
// will not let the second half be skipped. Choosing a tier move arms the review;
// it is only recordable once the board has also said what happens to the
// rating. "Keep the current rating" is one of those answers and is recorded --
// a decision that leaves no trace is indistinguishable from the omission this
// rule exists to prevent.
function buildReviewPanelHtml(name){
  const snap = reviewSnapshot();
  const s = snap[name];
  const live = V3_STATE.players[name];
  if(!live) return `<div class="section-sub" style="color:var(--red);">${name} has no v3 record.</div>`;
  if(!s) return `<div class="section-sub" style="color:var(--red);">${name} has no recorded state before ${reviewToday()}, so there is nothing to review against.</div>`;

  const last = ClubDecision.lastEventDate((V3_RECORD && V3_RECORD.journey) || [], playerIdFor(name));
  const d = reviewDraft && reviewDraft.playerId === name ? reviewDraft : null;
  const up = TIER_ABOVE[s.tier], down = TIER_BELOW[s.tier];

  let html = `<div class="callout-card" style="padding:12px; margin-top:10px;">
    <div style="font-weight:700; color:var(--text); font-size:14px;">${name}</div>
    <div class="section-sub" style="margin-top:2px;">Tier ${s.tier} · Power Rating <b style="color:var(--text);">${(Math.round(s.rating*10)/10).toFixed(1)}</b> · Reliability ${Math.round(Engine_reliability(s.effectiveEvidence)*100)}% · ${s.lifetimeMatches} rated matches · ${s.classificationStatus || 'status unknown'}</div>
    <div class="section-sub" style="font-size:10.5px;">Figures are as they stood before ${reviewToday()} (last event ${s.asOfDate}). Everyone reviewed today is measured against this same snapshot, so the order the board works through them cannot change what anybody is offered.</div>`;

  // ---- Step 1: the tier decision ----
  html += `<div class="section-heading" style="margin-top:12px;">1 · Tier</div>`;
  html += `<div class="difficulty-row" style="margin-top:4px;">
    ${up ? `<button class="preset-btn review-tier ${d && d.tierEvent==='PROMOTION' ? 'active':''}" data-player="${name}" data-event="PROMOTION" data-tier="${up}" style="flex:1;">Promote to ${up}</button>` : ''}
    ${down ? `<button class="preset-btn review-tier ${d && d.tierEvent==='DEMOTION' ? 'active':''}" data-player="${name}" data-event="DEMOTION" data-tier="${down}" style="flex:1;">Demote to ${down}</button>` : ''}
    <button class="preset-btn review-tier ${d && d.tierEvent==='TIER_RETAINED' ? 'active':''}" data-player="${name}" data-event="TIER_RETAINED" data-tier="${s.tier}" style="flex:1;">Retain ${s.tier}</button>
  </div>`;

  if(!d){
    html += `<div class="section-sub" style="margin-top:8px;">Choose a tier decision to begin. A tier change moves no points on its own — the rating decision below is a separate, required step.</div>`;
    html += `<div style="margin-top:10px;"><button class="preset-btn" id="reviewCloseBtn" style="width:100%;">Close review</button></div></div>`;
    return html;
  }

  // ---- Step 2: the rating decision, which cannot be skipped ----
  const rec = d.recommendation;
  html += `<div class="section-heading" style="margin-top:12px;">2 · Rating — required</div>`;
  html += `<div class="section-sub">This review cannot be recorded until the board says what happens to ${name}'s Power Rating. Leaving it unanswered is what creates a request to backdate months later.</div>`;

  if(d.tierEvent === 'TIER_RETAINED'){
    html += `<div class="section-sub" style="font-size:10.5px;">Retaining a tier crosses no boundary, so there is no statistical recommendation to offer.</div>`;
  } else if(rec && rec.recommended){
    html += `<div class="section-sub">Recommendation: <b style="color:var(--text);">${(Math.round(rec.recommendationRating*10)/10).toFixed(1)}</b> (${rec.ratingDelta>=0?'+':''}${Math.round(rec.ratingDelta*10)/10}). ${rec.reason} Boundary T2 ${rec.t2.toFixed(1)}, from ${rec.establishedFrom} established in ${rec.fromTier} and ${rec.establishedTo} in ${rec.toTier}.</div>`;
    html += `<div class="section-sub" style="font-size:10.5px;">${rec.caveats.join(' ')}</div>`;
  } else {
    html += `<div class="section-sub">No statistical recommendation: ${rec ? rec.reason : 'not calculated.'}</div>`;
  }

  // An action the board cannot take is shown, disabled, with the reason in the
  // same row -- never as a live-looking Choose button. Hiding it entirely would
  // leave the board wondering whether the branch exists at all.
  const opt = (key, label, enabled, why) => `<div class="alpha-row${enabled ? '' : ' row-unavailable'}">
    <div class="alpha-name" style="font-size:12.5px;">${label}${why ? `<div style="font-size:10px; color:var(--text-dim);">${why}</div>` : ''}</div>
    <button class="preset-btn review-decision ${d.ratingDecision===key?'active':''}" data-decision="${key}" style="width:104px;" ${enabled?'':'disabled'}>${enabled ? (d.ratingDecision===key ? 'Chosen' : 'Choose') : 'Unavailable'}</button>
  </div>${enabled ? '' : `<div class="reason-note">ⓘ ${why}</div>`}`;

  const canAccept = !!(rec && rec.recommended);
  const provisional = s.classificationStatus === 'PROVISIONAL';
  html += opt('ACCEPT_RECOMMENDATION', 'Accept the statistical recommendation', canAccept,
    canAccept ? `Moves to ${(Math.round(rec.recommendationRating*10)/10).toFixed(1)}` : 'No recommendation is available');
  html += opt('CLUB_OVERRIDE', 'Club override', true, 'The board sets the rating itself');
  html += opt('KEEP_CURRENT_RATING', 'Keep the current rating', true, `Recorded as a decision, not an omission — stays at ${(Math.round(s.rating*10)/10).toFixed(1)}`);
  html += opt('CORRECT_INITIAL_CLASSIFICATION', 'Correct the initial classification', provisional,
    provisional ? 'The initial estimate was wrong — not a reward for development'
      : `${name} is already established, so there is no initial estimate left to correct`);

  // Reliability used to be asked for here as well, which put two Reliability
  // inputs on one screen once step 3 existed -- the board could set it twice,
  // differently, and only one would win. Step 3 owns it now.
  if(d.ratingDecision === 'CLUB_OVERRIDE'){
    html += `<div class="fg-controls" style="margin-top:6px;">
      <div class="fg-row"><label class="fg-label">Power Rating</label><input id="reviewOverrideRating" class="fg-select" value="${d.overrideRating ?? ''}" placeholder="leave blank to keep ${(Math.round(s.rating*10)/10).toFixed(1)}" /></div>
    </div>`;
  }
  if(d.ratingDecision === 'CORRECT_INITIAL_CLASSIFICATION'){
    html += `<div class="fg-controls" style="margin-top:6px;">
      <div class="fg-row"><label class="fg-label">Corrected Power Rating</label><input id="reviewCorrectedRating" class="fg-select" value="${d.correctedRating ?? ''}" placeholder="the rating the club believes was right" /></div>
    </div>`;
  }

  html += `<div id="reviewReliabilityBlock">${buildReviewReliabilityHtml(d, s, snap, name)}</div>`;

  html += `<div class="fg-controls" style="margin-top:6px;">
    <div class="fg-row"><label class="fg-label">Note (recorded)</label><input id="reviewNote" class="fg-select" value="${d.notes || ''}" placeholder="Why the club decided this" /></div>
  </div>`;

  // Always rendered, even when empty: typing into a field updates this in
  // place rather than re-rendering the screen, and it has to exist to be
  // updated. Before, validation ran only at render time, so entering a valid
  // Reliability and reason left the old warnings on screen and the stage
  // button disabled until something unrelated forced a re-render.
  const missing = MonthlyReview.incompleteReasons(reviewDraftForCheck(), snap);
  html += `<div id="reviewMissing" class="section-sub" style="color:var(--gold-bright); margin-top:6px;">${missingHtml(missing)}</div>`;
  html += `<div class="difficulty-row" style="margin-top:8px;">
    <button class="preset-btn" id="reviewStageBtn" style="flex:1;" ${missing.length?'disabled':''}>Review what will be recorded</button>
    <button class="preset-btn" id="reviewCloseBtn" style="flex:1;">Close</button>
  </div>`;
  html += `</div>`;

  if(reviewPending) html += buildReviewConfirmHtml();
  return html;
}

// Re-attachable, because the Reliability block is rebuilt in place whenever the
// rating changes and its buttons go with it.
function wireReviewReliabilityChoices(){
  document.querySelectorAll('.review-reliability').forEach(el=>{
    el.onclick = ()=>{
      if(!reviewDraft) return;
      reviewDraft = { ...reviewDraftForCheck(), reliabilityChoice: el.dataset.reliability };
      reviewPending = null; reviewMessage = '';
      renderManage();
    };
  });
}

function missingHtml(missing){
  return missing.length ? missing.map(m=>`• ${m}`).join('<br/>') : '';
}

// Validation used to run only while the screen was being built, so typing a
// valid answer changed nothing until something else forced a re-render. This
// folds the fields into the draft and refreshes what the answer affects,
// WITHOUT rebuilding the screen -- a re-render on every keystroke would take
// the caret out of the field being typed into, and a re-render on blur can
// swallow the click that caused it.
//
// `fromRating` says the rating changed, which is the one case where the
// Reliability step's own content is stale too: its recommendation is priced
// against the anchor. That block is only rebuilt then, because rebuilding it
// while someone is typing INTO it would destroy the field under them.
function refreshReviewValidation({ fromRating } = {}){
  if(!reviewDraft) return;
  reviewDraft = reviewDraftForCheck();
  const snap = reviewSnapshot();
  if(!snap) return;

  if(fromRating){
    const host = document.getElementById('reviewReliabilityBlock');
    const s = snap[reviewDraft.playerId];
    if(host && s) host.innerHTML = buildReviewReliabilityHtml(reviewDraft, s, snap, reviewDraft.playerId);
    wireReviewReliabilityChoices();
  }

  const missing = MonthlyReview.incompleteReasons(reviewDraftForCheck(), snap);
  const box = document.getElementById('reviewMissing');
  if(box) box.innerHTML = missingHtml(missing);
  const stage = document.getElementById('reviewStageBtn');
  if(stage) stage.disabled = missing.length > 0;
}

// ---- Step 3: Reliability, once a rating is on the table ----
//
// Shaun's rule (20 Sep): the board should not have to invent a Reliability
// percentage. The system recommends one from how far the rating actually moves
// -- the anchor the board chose, not the one the app suggested -- and the board
// either takes it or departs from it deliberately.
//
// A departure has to say why. A percentage with no reason behind it is
// indistinguishable from a slip of the finger, and this is the permanent record.
function buildReviewReliabilityHtml(d, s, snap, name){
  const draft = reviewDraftForCheck();
  const rec = MonthlyReview.reliabilityRecommendationFor(draft, snap);
  const now = Engine_reliability(s.effectiveEvidence);
  const band = (r) => (typeof V3Bridge !== 'undefined' && V3Bridge.reliabilityBand)
    ? V3Bridge.reliabilityBand(r) : '';
  const pc = (r) => Math.round(r * 100) + '%';

  let html = `<div class="section-heading" style="margin-top:12px;">3 · Reliability</div>`;

  if(!rec){
    // Only reachable before the rating question is answered. Saying nothing
    // would read as "no change needed"; this says which it is.
    html += `<div class="section-sub">${name} stays at <b style="color:var(--text);">${pc(now)}</b> (${band(now)}). `
      + `A Reliability recommendation follows the size of the rating change, so answer the rating above first.</div>`;
    return html;
  }

  html += `<div class="section-sub">Recommended: <b style="color:var(--text);">${pc(rec.reliability)}</b> (${band(rec.reliability)}), `
    + `from ${pc(now)} (${band(now)}). ${rec.reason}</div>`;
  html += `<div class="section-sub" style="font-size:10.5px;">Reliability is how much evidence stands behind the rating, and it sets how fast results move it: `
    + `${pc(rec.reliability)} means K ${RatingEngine.kForEvidence(RatingEngine.effectiveEvidenceForReliability(rec.reliability)).toFixed(1)}, `
    + `and about ${Math.max(0, Math.ceil(RatingEngine.effectiveEvidenceForReliability(0.5) - RatingEngine.effectiveEvidenceForReliability(rec.reliability)))} matches back to 50%.</div>`;

  const choice = d.reliabilityChoice || null;
  const relOpt = (key, label, why) => `<div class="alpha-row">
    <div class="alpha-name" style="font-size:12.5px;">${label}${why ? `<div style="font-size:10px; color:var(--text-dim);">${why}</div>` : ''}</div>
    <button class="preset-btn review-reliability ${choice===key?'active':''}" data-reliability="${key}" style="width:104px;">${choice===key ? 'Chosen' : 'Choose'}</button>
  </div>`;
  html += relOpt('USE_RECOMMENDATION', 'Use the recommendation', `Records ${pc(rec.reliability)}`);
  html += relOpt('OVERRIDE', 'Override Reliability', 'The board sets it, with a reason');

  if(choice === 'OVERRIDE'){
    html += `<div class="fg-controls" style="margin-top:6px;">
      <div class="fg-row"><label class="fg-label">Reliability %</label><input id="reviewRelOverride" class="fg-select" value="${d.overrideReliability!=null ? Math.round(d.overrideReliability*100) : ''}" placeholder="the percentage the board decides" /></div>
    </div>`;
    html += `<div class="section-sub" style="font-size:10.5px;">Recorded as a club override beside the ${pc(rec.reliability)} it departs from, with the note below as its reason.</div>`;
  }
  return html;
}


// Nothing is written until this is confirmed, and it states the exact document
// id and the exact before/after rather than a reassuring summary.
function buildReviewConfirmHtml(){
  const list = reviewPending;
  return `<div class="callout-card" style="padding:12px; margin-top:10px; border-color:var(--gold-dim);">
    <div style="font-weight:700; color:var(--gold-bright);">Confirm — this writes ${list.length === 1 ? 'one event' : `${list.length} events`} to the permanent record</div>
    ${list.map((p,i)=>`<div class="section-sub" style="margin-top:4px; color:var(--text);">${i+1}. ${p.summary}</div>
      <div class="section-sub" style="font-size:10.5px;">${p.event.eventType}, effective ${p.event.effectiveDate}, as <code>${p.journeyDoc.id}</code>.</div>`).join('')}
    <div class="section-sub" style="font-size:10.5px;">Attributed to ${list[0].journeyDoc.createdBy}. Nothing here can be deleted; to undo it you record a reversal.</div>
    <div class="difficulty-row" style="margin-top:8px;">
      <button class="preset-btn" id="reviewConfirmBtn" style="flex:1;">Record it</button>
      <button class="preset-btn" id="reviewCancelBtn" style="flex:1;">Cancel</button>
    </div>
  </div>`;
}

// Every button here only ever STAGES a decision. Nothing reaches the database
// without a second, explicit confirmation showing the exact document.
function wireReviewSection(){
  document.querySelectorAll('.review-pick').forEach(el=>{
    el.onclick = ()=>{ reviewSubject = el.dataset.player; reviewDraft = null; reviewPending = null; reviewMessage = ''; renderManage(); };
  });
  const anyBtn = document.getElementById('reviewAnyBtn');
  if(anyBtn) anyBtn.onclick = ()=>{
    const raw = (document.getElementById('reviewAnyName').value || '').trim();
    const match = Object.keys(V3_STATE.players || {}).find(n => n.toLowerCase() === raw.toLowerCase());
    if(!match){ reviewMessage = raw ? `No v3 record for "${raw}".` : 'Enter a player name.'; }
    else { reviewSubject = match; reviewDraft = null; reviewPending = null; reviewMessage = ''; }
    renderManage();
  };
  const closeBtn = document.getElementById('reviewCloseBtn');
  if(closeBtn) closeBtn.onclick = ()=>{ reviewSubject = null; reviewDraft = null; reviewPending = null; reviewMessage = ''; renderManage(); };

  // Step 1. Arms the review and computes the recommendation from the shared
  // snapshot -- never from live state, which already contains any decision
  // recorded earlier today.
  document.querySelectorAll('.review-tier').forEach(el=>{
    el.onclick = ()=>{
      const name = el.dataset.player;
      const snap = reviewSnapshot();
      const s = snap[name];
      const toTier = el.dataset.tier;
      const eventType = el.dataset.event;
      reviewDraft = {
        playerId: name,
        effectiveDate: reviewToday(),
        tierEvent: eventType,
        newTier: toTier,
        ratingDecision: null,
        overrideRating: null, overrideReliability: null,
        reliabilityChoice: null,
        correctedRating: null, correctedReliability: null,
        notes: null,
        recommendation: (eventType === 'TIER_RETAINED' || !s) ? null
          : MonthlyReview.recommendationFor(snap, {
              playerId: name, fromTier: s.tier, toTier, eventType,
            }),
      };
      reviewPending = null; reviewMessage = '';
      renderManage();
    };
  });

  // Step 2. Choosing a rating answer never writes; it only completes the draft.
  document.querySelectorAll('.review-decision').forEach(el=>{
    el.onclick = ()=>{
      if(!reviewDraft) return;
      if(el.disabled) return; // an unavailable branch is never recordable
      reviewDraft = { ...reviewDraftForCheck(), ratingDecision: el.dataset.decision };
      reviewPending = null; reviewMessage = '';
      renderManage();
    };
  });

  // Step 3. Same contract as step 2: choosing completes the draft, writes nothing.
  wireReviewReliabilityChoices();

  // Live validation. Typing is the whole point: the answer must be accepted as
  // it is given, not on the next unrelated tap.
  [
    { id: 'reviewOverrideRating', fromRating: true },
    { id: 'reviewCorrectedRating', fromRating: true },
    { id: 'reviewRelOverride', fromRating: false },
    { id: 'reviewNote', fromRating: false },
  ].forEach(({ id, fromRating })=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('input', ()=> refreshReviewValidation({ fromRating }));
  });

  const stageBtn = document.getElementById('reviewStageBtn');
  if(stageBtn) stageBtn.onclick = ()=>{ reviewDraft = reviewDraftForCheck(); stageReview(); };

  const diagBtn = document.getElementById('runDiagnosticsBtn');
  if(diagBtn) diagBtn.onclick = runBetaDiagnostics;

  const confirmBtn = document.getElementById('reviewConfirmBtn');
  if(confirmBtn) confirmBtn.onclick = commitReviewDecision;
  const cancelBtn = document.getElementById('reviewCancelBtn');
  if(cancelBtn) cancelBtn.onclick = ()=>{ reviewPending = null; reviewMessage = 'Cancelled — nothing was written.'; renderManage(); };
}

// Attribution is a record of intent, not proof of identity -- there is no login.
// It is still required, so a decision always says who believed they were making it.
function reviewActor(){
  return (currentUserName && currentUserName.trim()) || 'Admin (unnamed)';
}


// Builds a decision, runs it past ClubDecision, and holds it for confirmation.
// A refusal is shown verbatim: these are the reasons the record would stop
// being reconstructible, and softening them would defeat the point.
// Prepares BOTH halves of the review against the live record, applying the
// first to a working copy so the second is prepared against the state it will
// actually meet. Nothing is written.
function stageReview(){
  const snap = reviewSnapshot();
  const recordedAt = new Date().toISOString();
  try {
    const decisions = MonthlyReview.decisionsFor(reviewDraftForCheck(), snap)
      // A decision is about to become a document, so from here on the player
      // is an identity, not a label. Without this a renamed player's decision
      // would be filed under a player the record has never heard of.
      .map(d => ({ ...d, playerId: playerIdFor(d.playerId) }));
    const working = {};
    Object.entries(V3_STATE.playersById).forEach(([k,v])=>{ working[k] = {...v}; });
    const journey = ((V3_RECORD && V3_RECORD.journey) || []).slice();
    const prepared = [];
    decisions.forEach(decision=>{
      const p = ClubDecision.prepare({ state: working, journey, decision, today: reviewToday(), recordedAt });
      prepared.push(p);
      // Apply to the working copy so the next event is prepared against the
      // state it will meet, and cannot be refused as a same-day duplicate.
      RatingEngine.applyStateEvent(working, p.event);
      journey.push(p.event);
    });
    reviewPending = prepared;
    reviewMessage = '';
  } catch(e){
    reviewPending = null;
    reviewMessage = e.message;
  }
  renderManage();
}

async function commitReviewDecision(){
  const list = reviewPending;
  if(!list || !list.length) return;
  if(!db){ reviewMessage = 'No database connection — nothing was written.'; renderManage(); return; }
  const btn = document.getElementById('reviewConfirmBtn');
  if(btn){ btn.disabled = true; btn.textContent = 'Recording…'; }
  try {
    const backend = RatingStore.firestoreCompatBackend(db);
    // In order: the tier move, then the rating decision that completes it.
    for(const p of list){ await ClubDecision.commit(backend, p); }
    reviewPending = null;
    reviewDraft = null;
    reviewSnapshotCache = null;
    // Re-read rather than patch local state: the screen must show what is
    // actually stored, not what it believes it just stored.
    await loadV3State();
    reviewMessage = 'Recorded. ' + list.map(p=>p.summary).join(' ');
  } catch(e){
    reviewMessage = e.message;
  }
  dataChanged();
}

// Which admin sections are open right now. Deliberately NOT persisted: Shaun's
// rule is that the screen opens collapsed every time, so arriving at
// Admin/Manage always shows the same short list of what is available rather
// than wherever the last session happened to leave it.
let adminOpenSections = {};
function resetAdminSections(){ adminOpenSections = {}; }

// One component for every admin section. The whole header row is the tap
// target -- a chevron-sized hit area on a phone is a miss waiting to happen.
function adminSection(key, title, bodyHtml){
  const open = !!adminOpenSections[key];
  return `<div class="admin-acc${open ? ' is-open' : ''}" data-acc="${key}">
    <button type="button" class="admin-acc-head" data-acc-toggle="${key}" aria-expanded="${open}">
      <span class="admin-acc-title">${title}</span>
      <span class="admin-acc-chev" aria-hidden="true">▾</span>
    </button>
    ${open ? `<div class="admin-acc-body">${bodyHtml}</div>` : ''}
  </div>`;
}

// ---- Build stamp, the last thing on Admin / Manage -----------------------
// Which deployed build this device is actually running. A debugging aid, so
// it is deliberately quiet and not a card. Shown locked or unlocked: a build
// SHA is not sensitive, and a locked phone is still worth diagnosing. See
// buildStamp.js for where the SHA and date come from and why they are never
// fetched.
function buildStampHtml(){
  const b = BuildStamp.describe(window.MP_BUILD);
  return `<button type="button" class="build-stamp" id="buildStamp" data-copy="${escapeHtml(b.copyText)}" aria-label="${escapeHtml(b.copyText)}. Tap to copy.">
    <span class="build-stamp-title">${escapeHtml(b.title)}</span>
    <span class="build-stamp-sha" id="buildStampSha">${escapeHtml(b.build)}</span>
  </button>`;
}
function wireBuildStamp(){
  const btn = document.getElementById('buildStamp');
  if(!btn) return;
  const line = document.getElementById('buildStampSha');
  const original = line.textContent;
  let timer = null;
  const say = (text)=>{
    line.textContent = text;
    clearTimeout(timer);
    timer = setTimeout(()=>{ line.textContent = original; }, 1600);
  };
  btn.onclick = ()=>{
    copyText(btn.dataset.copy).then(ok => say(ok ? 'Copied' : original));
  };
}
function copyText(text){
  if(navigator.clipboard && navigator.clipboard.writeText){
    return navigator.clipboard.writeText(text).then(()=>true, ()=>legacyCopy(text));
  }
  return Promise.resolve(legacyCopy(text));
}
// Older iOS standalone web apps have no async clipboard.
function legacyCopy(text){
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch(e){ return false; }
}

function renderManage(){
  const box = document.getElementById('manageView');
  if(!isUnlocked){
    box.innerHTML = buildLockScreenHtml() + buildStampHtml();
    wireLockScreen(renderManage);
    wireBuildStamp();
    return;
  }
  let html = '';

  html += adminSection('predict', 'Predict a matchup',
    `<div class="section-sub">Pick up to two names per side and see what the current ratings expect — no game needs to exist yet. Leave a second name blank for singles.</div>`
    + `<div class="fg-controls">
    <div class="fg-row"><label class="fg-label">Team A</label>
      <input id="predA1" list="playerNamesList" class="fg-select" placeholder="Player name" style="margin-bottom:6px;" value="${predDraftName('teamA',0)}" />
      <input id="predA2" list="playerNamesList" class="fg-select" placeholder="Partner (optional)" value="${predDraftName('teamA',1)}" />
    </div>
    <div class="fg-row"><label class="fg-label">Team B</label>
      <input id="predB1" list="playerNamesList" class="fg-select" placeholder="Player name" style="margin-bottom:6px;" value="${predDraftName('teamB',0)}" />
      <input id="predB2" list="playerNamesList" class="fg-select" placeholder="Partner (optional)" value="${predDraftName('teamB',1)}" />
    </div>
    <div id="predResult"></div>
  </div>`);

  html += adminSection('players', 'Player tags',
    `<div class="section-sub">Toggle who's currently active — inactive players are skipped by every suggestion engine but keep their full history. You can also add someone who hasn't played yet.</div>`
    + `<div class="section-heading" style="margin-top:0;">Add a new player</div>`
    + `<div class="fg-controls">
    <div class="fg-row">
      <input id="npName" class="fg-select" placeholder="Name" style="margin-bottom:6px;" />
      <select id="npTier" class="fg-select">
        <option value="S">Tier S</option><option value="A">Tier A</option>
        <option value="B" selected>Tier B</option><option value="C">Tier C</option>
      </select>
    </div>
    <div class="fg-row"><button class="preset-btn" id="npAdd">+ Add player</button></div>
    <div id="npMessage" class="section-sub"></div>
  </div>`
    + `<div class="section-heading">Existing players</div>`
    + `<div class="section-sub" style="font-size:10.5px;">Tap a player to change their tier, the tier they started at, or whether they are active.</div>`
    + `<div class="fg-controls" style="padding-top:2px; padding-bottom:2px;"><div id="playerTagsList"></div></div>`);

  html += adminSection('visibility', 'Visible to everyone',
    `<div class="section-sub">Switch off anything you'd rather keep admin-only. You always see everything; these toggles only affect people who haven't unlocked. Matchmaking suggestions are hidden by default since they'd otherwise show everyone's ideal opponents to the whole group.</div>`
    + `<div class="fg-controls">` + Object.keys(VISIBILITY_DEFAULTS).map(key=>`
    <div class="alpha-row">
      <div class="alpha-name" style="font-size:13px;">${VISIBILITY_LABELS[key]}</div>
      <button class="preset-btn vis-toggle ${visibilityState[key]!==false?'active':''}" data-vis="${key}" style="width:100px;">${visibilityState[key]!==false?'Visible':'Admin only'}</button>
    </div>`).join('') + `<div id="visMessage" class="section-sub"></div></div>`);

  html += adminSection('review', 'Admin monthly review', buildReviewSectionHtml());
  html += adminSection('historical', 'Historical club adjustment', buildHistoricalAdjustmentHtml());
  html += adminSection('diagnostics', 'Beta diagnostics', buildDiagnosticsSectionHtml());

  html += adminSection('lock', 'Admin lock',
    `<div class="fg-controls">
    <div class="fg-row"><button class="preset-btn" id="lockNowBtn" style="width:100%;">Lock admin area</button></div>
  </div>`);

  html += adminSection('ownerpw', 'Your password',
    `<div class="section-sub">${ownerPasswordHash ? 'Change your own password. This never touches the board password.' : 'Not set yet — this shouldn\'t normally happen once one exists, but you can set it here if needed.'}</div>`
    + `<div class="fg-controls">
    <div class="fg-row"><input id="cpOwnerCurrent" type="password" class="fg-select" placeholder="${ownerPasswordHash ? 'Current password' : '(leave blank — not set yet)'}" style="margin-bottom:6px;" /></div>
    <div class="fg-row"><input id="cpOwnerNew" type="password" class="fg-select" placeholder="New password" /></div>
    <div class="fg-row"><button class="preset-btn" id="cpOwnerSubmit">Update your password</button></div>
    <div id="cpOwnerMessage" class="section-sub"></div>
  </div>`);

  html += adminSection('boardpw', 'Board password',
    `<div class="section-sub">${boardPasswordHash ? 'A second, independent password — whoever knows it can change it themselves without touching yours.' : 'Not set up yet. Set one here to give the board their own password, separate from yours.'}</div>`
    + `<div class="fg-controls">
    <div class="fg-row"><input id="cpBoardCurrent" type="password" class="fg-select" placeholder="${boardPasswordHash ? 'Current board password' : '(leave blank — not set yet)'}" style="margin-bottom:6px;" /></div>
    <div class="fg-row"><input id="cpBoardNew" type="password" class="fg-select" placeholder="New board password" /></div>
    <div class="fg-row"><button class="preset-btn" id="cpBoardSubmit">${boardPasswordHash ? 'Update board password' : 'Set board password'}</button></div>
    <div id="cpBoardMessage" class="section-sub"></div>
  </div>`);

  html += adminSection('export', 'Export data',
    `<div class="section-sub">Downloads a .csv file to your device — opens straight in Excel, Google Sheets, or Numbers.</div>`
    + `<div class="fg-controls">
    <div class="fg-row"><button class="preset-btn" id="exportMatchesBtn" style="width:100%;">Export all matches</button></div>
    <div class="fg-row"><button class="preset-btn" id="exportPlayersBtn" style="width:100%;">Export player stats</button></div>
    <div id="exportMessage" class="section-sub"></div>
  </div>`);

  html += buildStampHtml();

  box.innerHTML = html;
  wireBuildStamp();

  // The whole header row toggles. Re-rendering rather than toggling a class
  // keeps one source of truth for what is open, and the sections that build
  // their own DOM (the review, the player list) are rebuilt with it.
  box.querySelectorAll('[data-acc-toggle]').forEach(el=>{
    el.onclick = ()=>{
      const key = el.dataset.accToggle;
      adminOpenSections[key] = !adminOpenSections[key];
      renderManage();
      // Keep the section the finger is on in view: collapsing something above
      // it otherwise leaves the reader somewhere else entirely.
      const head = box.querySelector(`[data-acc-toggle="${key}"]`);
      if(head && adminOpenSections[key]) head.scrollIntoView({ block:'nearest' });
    };
  });

  wireReviewSection();
  wireHistoricalAdjustment();

  const today = new Date().toISOString().slice(0,10);

  function renderPrediction(){
    const resultBox = document.getElementById('predResult');
    if(!resultBox) return;
    const val = (id) => (document.getElementById(id) || {}).value || '';
    const teamA = [val('predA1').trim(), val('predA2').trim()].filter(Boolean);
    const teamB = [val('predB1').trim(), val('predB2').trim()].filter(Boolean);

    if(!teamA.length || !teamB.length){ resultBox.innerHTML = ''; predictionDraft = null; return; }

    const pred = predictMatchup(teamA, teamB);
    if(!pred.ok){
      predictionDraft = null;
      resultBox.innerHTML = `<div class="section-sub" style="color:var(--red);">${escapeHtml(pred.reason)}</div>`;
      return;
    }
    // Kept so "Add to Upcoming" carries these four players straight through
    // rather than asking the admin to name them a second time.
    predictionDraft = pred;
    resultBox.innerHTML = matchPredictionHtml(pred) + buildPredictionToUpcomingHtml(pred);
    wirePredictionToUpcoming(resultBox);
  }
  // Every wiring below has to tolerate its section being collapsed: the
  // markup for a closed accordion is not in the DOM at all. Before the
  // accordion every one of these elements always existed, so none of them
  // checked.
  const on = (id, fn) => { const el = document.getElementById(id); if(el) fn(el); };

  ['predA1','predA2','predB1','predB2'].forEach(id=>{
    on(id, (el)=> el.addEventListener('input', renderPrediction));
  });
  // The panel may have just been rebuilt around an existing draft -- after
  // adding the matchup to Upcoming, for instance. Draw what it already holds.
  if(predictionDraft) renderPrediction();

  on('npAdd', (btn)=>{ btn.onclick = async ()=>{
    const name = document.getElementById('npName').value.trim();
    const tier = document.getElementById('npTier').value;
    const msg = document.getElementById('npMessage');
    if(!name){ msg.textContent = 'Enter a name first.'; return; }
    if(PLAYERS.some(p=>p.name.toLowerCase()===name.toLowerCase())){
      msg.textContent = `${name} already exists.`; return;
    }
    tagOverridesState[name] = {...(tagOverridesState[name]||{}), tier, active:true};
    const ok = await saveTagOverrides(tagOverridesState);
    if(!ok){ msg.textContent = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage. Open the actual published/shared claude.ai link, not a downloaded file.`;; return; }
    msg.textContent = `${name} added to Tier ${tier}. They'll appear once they've played a game.`;
    document.getElementById('npName').value = '';
  }; });

  document.querySelectorAll('.vis-toggle').forEach(btn=>{
    btn.onclick = async ()=>{
      const key = btn.dataset.vis;
      visibilityState[key] = !(visibilityState[key] !== false);
      const ok = await saveVisibility(visibilityState);
      const msg = document.getElementById('visMessage');
      if(!ok){
        visibilityState[key] = !visibilityState[key]; // revert
        if(msg) msg.textContent = 'Save failed — try again.';
        return;
      }
      if(msg) msg.textContent = '';
      applyTabVisibility();
      renderManage();
    };
  });

  on('lockNowBtn', (btn)=>{ btn.onclick = async ()=>{
    isUnlocked = false;
    adminRole = null;
    await saveMyUnlocked(false);
    applyTabVisibility();
    renderManage();
  }; });

  on('cpOwnerSubmit', (btn)=>{ btn.onclick = async ()=>{
    const cur = document.getElementById('cpOwnerCurrent').value;
    const next = document.getElementById('cpOwnerNew').value;
    const msg = document.getElementById('cpOwnerMessage');
    if(ownerPasswordHash && simpleHash(cur) !== ownerPasswordHash){ msg.textContent = 'Current password is incorrect.'; return; }
    if(!next || next.length<4){ msg.textContent = 'New password needs at least 4 characters.'; return; }
    const ok = await savePasswordHash(STORAGE_KEY_ADMIN_PW_OWNER, simpleHash(next));
    if(!ok){ msg.textContent = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage. Open the actual published/shared claude.ai link, not a downloaded file.`; return; }
    ownerPasswordHash = simpleHash(next);
    msg.textContent = 'Your password has been updated.';
    document.getElementById('cpOwnerCurrent').value=''; document.getElementById('cpOwnerNew').value='';
  }; });

  on('cpBoardSubmit', (btn)=>{ btn.onclick = async ()=>{
    const cur = document.getElementById('cpBoardCurrent').value;
    const next = document.getElementById('cpBoardNew').value;
    const msg = document.getElementById('cpBoardMessage');
    if(boardPasswordHash && simpleHash(cur) !== boardPasswordHash){ msg.textContent = 'Current board password is incorrect.'; return; }
    if(!next || next.length<4){ msg.textContent = 'New password needs at least 4 characters.'; return; }
    const ok = await savePasswordHash(STORAGE_KEY_ADMIN_PW_BOARD, simpleHash(next));
    if(!ok){ msg.textContent = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage. Open the actual published/shared claude.ai link, not a downloaded file.`; return; }
    boardPasswordHash = simpleHash(next);
    msg.textContent = 'Board password has been updated.';
    document.getElementById('cpBoardCurrent').value=''; document.getElementById('cpBoardNew').value='';
  }; });

  on('exportMatchesBtn', (btn)=>{ btn.onclick = ()=>{
    try { exportMatchesCsv(); document.getElementById('exportMessage').textContent = 'Downloaded.'; }
    catch(e){ document.getElementById('exportMessage').textContent = 'Export failed: ' + (e.message||e); }
  }; });
  on('exportPlayersBtn', (btn)=>{ btn.onclick = ()=>{
    try { exportPlayersCsv(); document.getElementById('exportMessage').textContent = 'Downloaded.'; }
    catch(e){ document.getElementById('exportMessage').textContent = 'Export failed: ' + (e.message||e); }
  }; });

  // Only built when its section is open; everything else in Admin/Manage is
  // plain markup, but the player list builds its own DOM.
  if(document.getElementById('playerTagsList')) renderPlayerTagsList();
}

function csvEscape(val){
  const s = (val === null || val === undefined) ? '' : String(val);
  if(/[",\n]/.test(s)) return '"' + s.replace(/"/g,'""') + '"';
  return s;
}
function downloadCsv(filename, headers, rows){
  const lines = [headers.map(csvEscape).join(',')];
  rows.forEach(r => lines.push(r.map(csvEscape).join(',')));
  const csvContent = lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

function exportMatchesCsv(){
  const headers = ['Date','Type','Team A','Team B','Score','Winner','Draw','Team A Rating Going In','Team B Rating Going In','Expected Performance Score (Team A)','Actual Performance Score (Team A)','Game Share % (Team A)','Performance vs Expectation (pts)','Verified','Status','Submitted By'];
  const displayMatches = getDisplayMatches();
  const rows = displayMatches.map(m=>{
    const enrichedIdx = m.isDraw ? -1 : idToIdxGlobalForExport(m.id);
    const enriched = enrichedIdx >= 0 ? MATCHES[enrichedIdx] : null;
    return [
      m.date, m.type || 'doubles',
      m.winners.join(' & '), m.losers.join(' & '),
      m.sets.map(s=>s.join('-')).join(', '),
      m.isDraw ? '' : m.winners.join(' & '),
      m.isDraw ? 'Yes' : 'No',
      enriched ? enriched.team_w_rating : '',
      enriched ? enriched.team_l_rating : '',
      enriched ? enriched.expected_score : '',
      enriched ? enriched.actual_score : '',
      enriched ? Math.round(enriched.game_share_winner*1000)/10 : '',
      enriched ? Math.round(enriched.performance_residual*1000)/10 : '',
      m.verified === false ? 'No (pre-June, single-sourced)' : 'Yes',
      m._status || 'approved',
      m.submittedBy || (m.id.startsWith('base_') ? 'Historical record' : ''),
    ];
  });
  downloadCsv(`money_padel_matches_${new Date().toISOString().slice(0,10)}.csv`, headers, rows);
}

function idToIdxGlobalForExport(id){
  for(let i=0;i<ALL_MATCHES.length;i++){ if(ALL_MATCHES[i].id === id) return i; }
  return -1;
}

function exportPlayersCsv(){
  const headers = ['Name','Tier','Active','Rating','Games','Wins','Losses','Win %','Avg Opponent','Clutch %','Upset Wins','Upset Losses','Recent Form % (last 10)','Recent Form W-L'];
  const rows = PLAYERS.map(p=>[
    p.name, p.tier, INACTIVE_PLAYERS.has(p.name) ? 'No' : 'Yes',
    Math.round(p.rating*10)/10, p.total, p.wins, p.losses,
    p.total ? Math.round(1000*p.wins/p.total)/10 : 0,
    Math.round(p.avg_match_strength), p.avg_overperf_pct,
    p.upset_wins, p.upset_losses,
    p.recent_form !== null && p.recent_form !== undefined ? p.recent_form : '',
    (p.recent_form_wins !== undefined) ? `${p.recent_form_wins}-${p.recent_form_losses}` : '',
  ]);
  downloadCsv(`money_padel_players_${new Date().toISOString().slice(0,10)}.csv`, headers, rows);
}


function parseQuickEntryText(text){
  const rawLines = text.split('\n').map(l=>l.trim()).filter(l=>l.length>0);
  if(rawLines.length < 3){
    return { error: 'Needs a winning team line, at least one set score, and a losing team line.' };
  }

  const scoreRe = /(\d+)\s*-\s*(\d+)/;
  const teamLines = [];
  const setLines = [];
  rawLines.forEach(line=>{
    if(!line.includes('&') && !/[a-zA-Z]{3,}/.test(line.replace(/🏆/g,'')) && scoreRe.test(line)){
      setLines.push(line);
    } else {
      teamLines.push(line);
    }
  });

  if(teamLines.length !== 2){
    return { error: `Expected exactly 2 team lines but found ${teamLines.length}. Make sure each set score is on its own line, like "6-4".` };
  }
  if(setLines.length === 0){
    return { error: 'No set scores found — each set should be on its own line, like "6-4".' };
  }

  const [line1, line2] = teamLines;
  const line1HasTrophy = line1.includes('🏆');
  const line2HasTrophy = line2.includes('🏆');
  if(line1HasTrophy && line2HasTrophy){
    return { error: 'Both teams have 🏆 — put it next to at most one team, or remove it from both if this was a draw.' };
  }
  const isDraw = !line1HasTrophy && !line2HasTrophy;

  const cleanTeam = (line) => line.replace(/🏆/g,'').trim().split('&').map(n=>n.trim()).filter(n=>n.length>0);
  const team1 = cleanTeam(line1);
  const team2 = cleanTeam(line2);

  if(team1.length !== team2.length || (team1.length!==1 && team1.length!==2)){
    return { error: 'Each team needs the same number of players — 1 for singles, 2 for doubles.' };
  }

  const sets = [];
  setLines.forEach(line=>{
    const m = line.match(scoreRe);
    if(m) sets.push([parseInt(m[1],10), parseInt(m[2],10)]);
  });
  if(sets.length === 0){
    return { error: 'Could not read any set scores.' };
  }

  if(isDraw){
    return { winners: team1, losers: team2, sets, isSingles: team1.length === 1, isDraw: true };
  }

  const winnerIsTeam1 = line1HasTrophy;
  const orientedSets = winnerIsTeam1 ? sets : sets.map(([a,b])=>[b,a]);
  return {
    winners: winnerIsTeam1 ? team1 : team2,
    losers: winnerIsTeam1 ? team2 : team1,
    sets: orientedSets,
    isSingles: team1.length === 1,
  };
}

function renderAddGameSets(){
  const box = document.getElementById('agSets');
  box.innerHTML = addGameSets.map((s,i)=>`
    <div style="display:flex; gap:8px; align-items:center; margin-bottom:6px;">
      <input type="number" min="0" max="30" value="${s.w}" data-idx="${i}" data-side="w" class="ag-set-input fg-select" style="width:70px;" placeholder="A" />
      <span style="color:var(--text-dim);">–</span>
      <input type="number" min="0" max="30" value="${s.l}" data-idx="${i}" data-side="l" class="ag-set-input fg-select" style="width:70px;" placeholder="B" />
      ${addGameSets.length>1 ? `<button class="preset-btn" data-remove="${i}" style="margin-left:auto;">Remove</button>` : ''}
    </div>
  `).join('');
  box.querySelectorAll('.ag-set-input').forEach(inp=>{
    inp.addEventListener('input', e=>{
      const idx = parseInt(e.target.dataset.idx), side = e.target.dataset.side;
      addGameSets[idx][side] = e.target.value;
    });
  });
  box.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.onclick = ()=>{ addGameSets.splice(parseInt(btn.dataset.remove),1); renderAddGameSets(); };
  });
}

function checkForNewPlayers(){
  const names = ['agA1','agA2','agB1','agB2'].map(id=>document.getElementById(id).value.trim()).filter(n=>n);
  const known = new Set(PLAYERS.map(p=>p.name.toLowerCase()));
  const newNames = names.filter(n=>!known.has(n.toLowerCase()));
  const row = document.getElementById('agNewPlayerRow');
  const box = document.getElementById('agNewPlayerTiers');
  if(newNames.length===0){ row.style.display='none'; box.innerHTML=''; return; }
  row.style.display = 'block';
  box.innerHTML = newNames.map(n=>`
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
      <span style="font-size:13px; flex:1;">${n}</span>
      <select class="fg-select ag-new-tier" data-name="${n}" style="width:120px;">
        <option value="S">Tier S</option><option value="A">Tier A</option>
        <option value="B" selected>Tier B</option><option value="C">Tier C</option>
      </select>
    </div>
  `).join('');
}

async function submitNewGame(){
  const msg = document.getElementById('agMessage');
  const submitter = submissionIdentity();
  if(!submitter){
    msg.textContent = 'Choose who you are first — every submission is recorded against someone.';
    return;
  }
  // Kept in step so a device that has chosen a player also has the typed
  // fallback populated, and so nothing downstream that still reads
  // currentUserName sees a different person from the one on screen.
  if(currentUserName !== submitter){ currentUserName = submitter; await saveMyName(submitter); }

  const date = document.getElementById('agDate').value;
  const isSingles = document.querySelector('#agTypeToggle .fg-toggle-btn.active').dataset.type === 'singles';
  const isDraw = document.querySelector('#agOutcomeToggle .fg-toggle-btn.active').dataset.outcome === 'draw';
  const a1 = document.getElementById('agA1').value.trim();
  const a2 = document.getElementById('agA2').value.trim();
  const b1 = document.getElementById('agB1').value.trim();
  const b2 = document.getElementById('agB2').value.trim();

  if(!date || !a1 || !b1 || (!isSingles && (!a2 || !b2))){
    msg.textContent = 'Fill in the date and all player names.'; return;
  }
  const winners = isSingles ? [a1] : [a1,a2];
  const losers = isSingles ? [b1] : [b1,b2];
  if(new Set([...winners,...losers].map(n=>n.toLowerCase())).size !== winners.length+losers.length){
    msg.textContent = 'The same name appears twice — check your entries.'; return;
  }

  const sets = [];
  for(const s of addGameSets){
    const w = parseInt(s.w), l = parseInt(s.l);
    if(isNaN(w) || isNaN(l)) continue;
    sets.push([w,l]);
  }
  if(sets.length===0){ msg.textContent = 'Enter at least one set score.'; return; }
  if(!isDraw){
    const setsWon = sets.filter(s=>s[0]>s[1]).length, setsLost = sets.filter(s=>s[1]>s[0]).length;
    if(setsWon < setsLost){
      msg.textContent = 'Team A\'s scores should be the winning side — swap the teams, check your set scores, or mark this as not finished / a draw.'; return;
    }
  }

  // register any new players with chosen tiers
  document.querySelectorAll('.ag-new-tier').forEach(sel=>{
    const name = sel.dataset.name;
    tagOverridesState[name] = {...(tagOverridesState[name]||{}), tier: sel.value, active:true};
  });
  if(document.querySelectorAll('.ag-new-tier').length>0){
    await saveTagOverrides(tagOverridesState);
  }

  const id = 'sub_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
  const newMatch = {id, date, winners, losers, sets, type: isSingles?'singles':'doubles', note:'', isDraw,
                     status:'pending', submittedBy: submitter, submittedAt: new Date().toISOString()};
  // Submitted from an Upcoming card: the player has SAID which fixture this
  // was. That is a proposal, not a link -- an admin confirms it when
  // approving, and the fixture stays in Upcoming until then (D3).
  if(linkedRequestId) newMatch.fixtureId = linkedRequestId;
  extraMatchesState.push(newMatch);
  const ok = await saveExtraMatches(extraMatchesState);
  if(!ok){ msg.textContent = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage. Open the actual published/shared claude.ai link, not a downloaded file.`;; extraMatchesState.pop(); return; }

  let linkedNote = '';
  if(linkedRequestId){
    linkedNote = ' The game stays listed until an admin confirms this was it.';
    linkedRequestId = null;
  }

  const confirmation = isDraw
    ? `Submitted as a draw. ${winners.join(' & ')} vs ${losers.join(' & ')} — waiting for approval, won't affect any rating.${linkedNote}`
    : `Submitted. ${winners.join(' & ')} def ${losers.join(' & ')} — waiting for approval in the Games tab.${linkedNote}`;

  // The form is part of the Games screen, so redrawing that screen empties it
  // -- which is what the six lines of by-hand field clearing here used to be
  // for. The set rows are module state and have to be reset BEFORE the redraw
  // rather than after it, or the screen is rebuilt around the old ones.
  addGameSets = [{w:'',l:''},{w:'',l:''}];
  dataChanged();
  // Into the freshly drawn screen, not the one that has just been replaced.
  const freshMsg = document.getElementById('agMessage');
  if(freshMsg) freshMsg.textContent = confirmation;
}

// Which player rows are expanded. Like the admin sections, this is not
// persisted -- the list is meant to read as a roster, and it should look the
// same every time it is opened.
let openPlayerTags = {};

// Rename state. Nothing here is persisted: a half-typed name should not
// survive a reload, and the confirmation should never be pre-armed.
let renameDraft = {};        // display name -> what is being typed
let renameConfirm = null;    // the plan awaiting a yes
let renameBusy = false;
let renameMessage = null;
let renameMessageFor = null; // the playerId the message belongs to
let renameOk = false;

// Element ids have to be usable in a selector, and a player name is free text.
function escapeAttrId(value){
  return String(value).replace(/[^A-Za-z0-9_-]/g, '_');
}

// Renaming writes ONE field on ONE document. It does not touch a match, a
// journey event, or any document id -- which is what makes it safe to do
// twice, or fifty times. See assets/js/playerNames.js.
async function commitRename(displayName){
  const player = PLAYERS.find(p => p.name === displayName);
  const docs = (V3_STATE && V3_STATE.rawPlayerDocs) || [];
  const plan = PlayerNames.planRename(renameDraft[displayName], {
    playerId: player ? player.playerId : displayName, docs,
  });
  renameMessageFor = player ? player.playerId : displayName;
  if(!plan.ok){
    renameOk = false; renameMessage = plan.reason; renameConfirm = null;
    renderPlayerTagsList();
    return;
  }
  if(!db){
    renameOk = false; renameMessage = 'No database connection.';
    renderPlayerTagsList();
    return;
  }
  renameBusy = true; renderPlayerTagsList();
  try {
    const stored = docs.find(d => d.id === plan.playerId);
    // set() with the whole document rather than a partial update, because the
    // compat backend offers set and the document is small -- and writing it
    // whole means the stored shape cannot be half-updated.
    await db.collection(RatingStore.COLLECTIONS.players).doc(plan.playerId)
      .set({ ...stored, ...plan.update });
    renameOk = true;
    renameMessage = `${plan.from} is now ${plan.to}. Nothing else changed.`;
    renameConfirm = null;
    delete renameDraft[displayName];
    // Re-read so every screen picks up the new label from the record rather
    // than from an assumption about what was just written.
    await loadV3State();
    dataChanged();
  } catch(e){
    renameOk = false;
    renameMessage = 'Could not rename: ' + (e && e.message ? e.message : String(e));
  } finally {
    renameBusy = false;
    renderPlayerTagsList();
  }
}

function renderPlayerTagsList(){
  const box = document.getElementById('playerTagsList');
  if(!box) return;
  const rows = [...PLAYERS].sort((a,b)=>a.name.localeCompare(b.name));
  box.innerHTML = rows.map(p=>{
    const startingTier = STARTING_TIER_MAP[p.name] || '';
    const open = !!openPlayerTags[p.name];
    // What the row says without being opened: what they are now, and where
    // they started if that differs. Enough to find the one you came for.
    const summary = `Tier ${p.tier}`
      + (startingTier && startingTier !== p.tier ? ` · started at ${startingTier}` : '');
    return `
    <div class="ptag-row${open ? ' is-open' : ''}" data-row="${p.name}">
      <button type="button" class="ptag-summary" data-ptag-toggle="${p.name}" aria-expanded="${open}">
        <span style="min-width:0;">
          <span class="ptag-name">${p.name}</span>
          <span class="ptag-meta">${summary}</span>
        </span>
        <span class="ptag-right">
          <span class="ptag-state${p.active ? ' is-active' : ''}">${p.active ? 'Active' : 'Inactive'}</span>
          <span class="ptag-chev" aria-hidden="true">▾</span>
        </span>
      </button>
      ${open ? `<div class="ptag-controls">
        <select class="fg-select ptag-tier" data-name="${p.name}" aria-label="Current tier for ${p.name}">
          ${['S','A','B','C'].map(t=>`<option value="${t}" ${t===p.tier?'selected':''}>Tier ${t}</option>`).join('')}
        </select>
        <button class="preset-btn ptag-active ${p.active?'active':''}" data-name="${p.name}">${p.active?'Active':'Inactive'}</button>
        <select class="fg-select ptag-starting" data-name="${p.name}" title="Only affects how their rating was seeded at their first match" aria-label="Starting tier for ${p.name}">
          <option value="" ${startingTier===''?'selected':''}>Started: same as now</option>
          ${['S','A','B','C'].map(t=>`<option value="${t}" ${t===startingTier?'selected':''}>Started at Tier ${t}</option>`).join('')}
        </select>
      </div>
      <div class="ptag-rename">
        <label class="fg-label" for="ptagRename-${escapeAttrId(p.name)}">Name</label>
        <input class="fg-select ptag-rename-input" id="ptagRename-${escapeAttrId(p.name)}"
          data-name="${escapeHtml(p.name)}" value="${escapeHtml(renameDraft[p.name] !== undefined ? renameDraft[p.name] : p.name)}"
          placeholder="${escapeHtml(p.name)}" />
        ${renameConfirm && renameConfirm.playerId === p.playerId
          ? `<div class="ptag-rename-confirm">
               <div>Rename <b>${escapeHtml(renameConfirm.from)}</b> to <b>${escapeHtml(renameConfirm.to)}</b>?</div>
               <div class="ptag-rename-note">Their record does not move. Every match, rating, tier change and statistic stays exactly where it is — only what they are called changes.</div>
               <div class="cc-meta-row">
                 <button class="preset-btn ptag-rename-go" data-name="${escapeHtml(p.name)}">${renameBusy ? 'Renaming…' : 'Rename'}</button>
                 <button class="preset-btn ptag-rename-cancel" data-name="${escapeHtml(p.name)}">Cancel</button>
               </div>
             </div>`
          : `<button class="preset-btn ptag-rename-ask" data-name="${escapeHtml(p.name)}">Rename…</button>`}
        ${renameMessage && renameMessageFor === p.playerId
          ? `<div class="ptag-rename-note${renameOk ? '' : ' is-bad'}">${escapeHtml(renameMessage)}</div>` : ''}
        ${p.previousDisplayNames && p.previousDisplayNames.length
          ? `<div class="ptag-rename-note">Previously ${p.previousDisplayNames.map(n=>escapeHtml(n)).join(', ')}.</div>` : ''}
      </div>` : ''}
    </div>
  `;}).join('');

  box.querySelectorAll('.ptag-rename-input').forEach(inp=>{
    inp.addEventListener('input', ()=>{ renameDraft[inp.dataset.name] = inp.value; });
  });
  box.querySelectorAll('.ptag-rename-ask').forEach(btn=>{
    btn.onclick = ()=>{
      const n = btn.dataset.name;
      const player = PLAYERS.find(p => p.name === n);
      const docs = (V3_STATE && V3_STATE.rawPlayerDocs) || [];
      const plan = PlayerNames.planRename(renameDraft[n] !== undefined ? renameDraft[n] : n, {
        playerId: player ? player.playerId : n, docs,
      });
      renameMessageFor = player ? player.playerId : n;
      // Everything is checked BEFORE the confirmation, so the confirmation
      // only ever asks about a rename that would actually work.
      if(!plan.ok){ renameOk = false; renameMessage = plan.reason; renameConfirm = null; }
      else { renameOk = true; renameMessage = null; renameConfirm = plan; }
      renderPlayerTagsList();
    };
  });
  box.querySelectorAll('.ptag-rename-cancel').forEach(btn=>{
    btn.onclick = ()=>{ renameConfirm = null; renameMessage = null; renderPlayerTagsList(); };
  });
  box.querySelectorAll('.ptag-rename-go').forEach(btn=>{
    btn.onclick = ()=>{ if(!renameBusy) commitRename(btn.dataset.name); };
  });

  box.querySelectorAll('[data-ptag-toggle]').forEach(el=>{
    el.onclick = ()=>{
      const n = el.dataset.ptagToggle;
      openPlayerTags[n] = !openPlayerTags[n];
      renderPlayerTagsList();
    };
  });

  box.querySelectorAll('.ptag-tier').forEach(sel=>{
    sel.addEventListener('change', async e=>{
      const name = e.target.dataset.name;
      tagOverridesState[name] = {...(tagOverridesState[name]||{}), tier: e.target.value};
      await saveTagOverrides(tagOverridesState);
      dataChanged({ redraw: renderPlayerTagsList });
    });
  });
  box.querySelectorAll('.ptag-starting').forEach(sel=>{
    sel.addEventListener('change', async e=>{
      const name = e.target.dataset.name;
      const val = e.target.value;
      const cur = {...(tagOverridesState[name]||{})};
      if(val) cur.startingTier = val; else delete cur.startingTier;
      tagOverridesState[name] = cur;
      await saveTagOverrides(tagOverridesState);
      dataChanged({ redraw: renderPlayerTagsList });
    });
  });
  box.querySelectorAll('.ptag-active').forEach(btn=>{
    btn.addEventListener('click', async e=>{
      const name = e.target.dataset.name;
      const cur = PLAYERS.find(p=>p.name===name);
      const newActive = !(cur ? cur.active : true);
      tagOverridesState[name] = {...(tagOverridesState[name]||{}), active: newActive};
      const ok = await saveTagOverrides(tagOverridesState);
      if(!ok) return;
      dataChanged({ redraw: renderPlayerTagsList });
    });
  });
}

// ===================== INIT =====================

// Games: the screen is features/games/gamesScreen.js; approvals, edits and the
// historical match correction are features/games/gamesAdmin.js. The Games
// screen state below stays here with the other per-screen state.
let editingMatchId = null;
let armedDeleteId = null;
let expandedGameId = null;
let addGameExpanded = false;


function fmtRelative(iso){
  if(!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffH = Math.round((now-d)/3600000);
  if(diffH < 1) return 'just now';
  if(diffH < 24) return diffH + 'h ago';
  const diffD = Math.round(diffH/24);
  return diffD + 'd ago';
}

// ===================== WHO IS DOING THIS =====================
// The app already knows who you are. It should not keep asking.
//
// There were two identities. `currentUserName` is a free-text label typed into
// a "Your name" box and kept on the device; the VIEWER is the player chosen in
// the header, validated against the club's actual roster, and already used for
// Home, Your Game and challenges. The Games tab carried a full-width card for
// the first one on every visit -- a read-only field, above the filters, above
// the match log, restating something the header had already established.
//
// The viewer wins where it exists, which is what the challenge code had
// already concluded for itself (`viewerNow ? viewerNow.name : currentUserName`).
// This is not a presentation change dressed up: a real player picked from the
// roster is BETTER attribution than free text, and everything written to the
// record -- `submittedBy`, the review actor, `seenBy` -- goes on being written
// exactly as before, from whichever identity is the more reliable one.
//
// The typed name survives as the fallback for a device that has never chosen a
// player, so nothing that worked before stops working.
function submissionIdentity(){
  const viewer = (typeof getCurrentViewer === 'function') ? getCurrentViewer() : null;
  if(viewer && viewer.name) return viewer.name;
  return (currentUserName && currentUserName.trim()) || '';
}

// Shown inside a flow that is about to record who did something, and nowhere
// else. `change` opens the same player chooser the header uses -- one way to
// say who you are, not two.
function identityLineHtml(verb){
  const who = submissionIdentity();
  if(!who){
    return `<div class="identity-line">Nobody chosen yet —
      <button type="button" class="identity-change" data-identity-pick>choose who you are</button></div>`;
  }
  return `<div class="identity-line">${escapeHtml(verb)} as <b>${escapeHtml(who)}</b>
    <button type="button" class="identity-change" data-identity-pick>change</button></div>`;
}

function wireIdentityLines(box){
  (box || document).querySelectorAll('[data-identity-pick]').forEach(btn=>{
    btn.onclick = ()=>{ if(typeof buildViewerSelector === 'function') buildViewerSelector(); };
  });
}

function requireName(){
  let name = submissionIdentity();
  if(!name){
    // Nothing chosen and nothing typed, anywhere in the app. Ask directly
    // rather than refusing -- this is the last resort, not the normal path.
    let typed = '';
    try { typed = (window.prompt('Enter your name so the group knows who made this change:') || '').trim(); } catch(e){ /* prompt unavailable */ }
    if(!typed) return null;
    name = typed;
  }
  currentUserName = name;
  saveMyName(name);
  return name;
}

// ===================== HEAD TO HEAD =====================
// Compare's own month. All time by default: a head-to-head is a history, the
// same reasoning Shaun applied to Games. It used to read AND write the Rankings
// month, so choosing a month here silently changed Power Rankings.
let h2hMonth = 'all';
let h2hPlayerA = null;
let h2hPlayerB = null;

function renderH2H(){
  const box = document.getElementById('h2hView');
  const names = [...PLAYERS].map(p=>p.name).sort((a,b)=>a.localeCompare(b));
  if(!h2hPlayerA) h2hPlayerA = names[0];
  if(!h2hPlayerB) h2hPlayerB = names.find(n=>n!==h2hPlayerA) || names[0];

  let html = `<div class="fg-controls">
    <div class="fg-row"><label class="fg-label">Player A</label>
      <select id="h2hSelectA" class="fg-select"></select>
    </div>
    <div class="fg-row"><label class="fg-label">Player B</label>
      <select id="h2hSelectB" class="fg-select"></select>
    </div>
    <div class="fg-row"><label class="fg-label">Month</label>
      <select id="h2hMonthSelect" class="fg-select"></select>
    </div>
  </div>`;

  if(h2hPlayerA === h2hPlayerB){
    html += `<div class="section-sub">Pick two different players to compare.</div>`;
    box.innerHTML = html;
    populateMonthSelect(document.getElementById('h2hMonthSelect'), h2hMonth);
    document.getElementById('h2hMonthSelect').addEventListener('change', e=>{ h2hMonth = e.target.value; renderH2H(); });
    wireH2HSelects(names);
    return;
  }

  const monthActive = h2hMonth !== 'all';

  if(monthActive){
    const monthlyRatings = monthEndRatings(h2hMonth);
    const monthlyStatsAll = computeMonthlyStats(h2hMonth);
    const aHas = h2hPlayerA in monthlyRatings, bHas = h2hPlayerB in monthlyRatings;
    const aOverall = PLAYERS.find(p=>p.name===h2hPlayerA).rating;
    const bOverall = PLAYERS.find(p=>p.name===h2hPlayerB).rating;
    const aMonth = aHas ? Math.round(monthlyRatings[h2hPlayerA]) : null;
    const bMonth = bHas ? Math.round(monthlyRatings[h2hPlayerB]) : null;
    const aAhead = aHas && bHas && aMonth > bMonth;
    const bAhead = aHas && bHas && bMonth > aMonth;
    const aStats = monthlyStatsAll[h2hPlayerA];
    const bStats = monthlyStatsAll[h2hPlayerB];
    const aWL = aStats ? `<span style="color:var(--green);">${aStats.wins}W</span>-<span style="color:var(--red);">${aStats.losses}L</span>` : '0W-0L';
    const bWL = bStats ? `<span style="color:var(--green);">${bStats.wins}W</span>-<span style="color:var(--red);">${bStats.losses}L</span>` : '0W-0L';

    html += `<div class="section-heading" style="margin-top:6px;">📊 Power Rating — ${monthLabel(h2hMonth)}</div>`;
    html += `<div class="matchup-vs" style="padding:12px;">
      <div style="display:flex; justify-content:space-around; text-align:center;">
        <div>
          <div style="font-weight:700; margin-bottom:2px;">${h2hPlayerA}</div>
          <div style="font-size:24px; font-weight:700; color:${aAhead?'var(--gold-bright)':'var(--text)'};">${aMonth !== null ? aMonth : '–'}</div>
          <div style="font-size:11px; margin-top:2px;">${aWL}</div>
          <div style="font-size:10px; color:var(--text-dim);">overall: ${Math.round(aOverall)}</div>
        </div>
        <div style="align-self:center; color:var(--text-dim); font-size:13px;">vs</div>
        <div>
          <div style="font-weight:700; margin-bottom:2px;">${h2hPlayerB}</div>
          <div style="font-size:24px; font-weight:700; color:${bAhead?'var(--gold-bright)':'var(--text)'};">${bMonth !== null ? bMonth : '–'}</div>
          <div style="font-size:11px; margin-top:2px;">${bWL}</div>
          <div style="font-size:10px; color:var(--text-dim);">overall: ${Math.round(bOverall)}</div>
        </div>
      </div>
    </div>`;

    html += `<div class="section-sub" style="padding:4px 2px;">The rating below is the continuous Power Rating, shown from where each player carried it into ${monthLabel(h2hMonth)}. It is not reset at the start of the month and not re-solved for the month: these are the moves the engine actually recorded, in order.</div>`;

    [h2hPlayerA, h2hPlayerB].forEach(pname=>{
      const monthJourney = computeMonthlyJourney(pname, h2hMonth);
      const monthEntries = monthJourney ? monthJourney.entries.filter(e=>e.kind==='match') : [];
      const startPoint = monthJourney ? Math.round(monthJourney.startRating) : null;
      html += `<div class="section-sub" style="font-weight:700; color:var(--text); margin-top:8px;">${pname}'s games this month${startPoint!==null ? ` — carried in at ${startPoint}` : ''}</div>`;
      if(monthEntries.length === 0){
        html += `<div class="section-sub">No games for ${pname} in ${monthLabel(h2hMonth)}.</div>`;
      } else {
        monthEntries.forEach(e=>{
          const m = MATCHES.find(x=>x.id===e.matchId);
          if(!m) return;
          const d = journeyMatchDescription(pname, e.matchId);
          const teamLabel = d && d.partner ? `${pname} &amp; ${d.partner}` : pname;
          const deltaClass = e.delta > 0 ? 'perf-pos' : (e.delta < 0 ? 'perf-neg' : '');
          const deltaLabel = e.delta > 0 ? `+${e.delta}` : `${e.delta}`;
          const isExpanded = expandedGameId === m.id;
          const detailContent = isExpanded ? buildMatchDetailBlock(m, true) : '';
          html += `<div class="callout-card" style="padding:8px 12px;">
            <div class="game-card-clickable h2h-month-game" data-gameid="${m.id}" style="cursor:pointer;">
              <div style="display:flex; justify-content:space-between; font-size:11.5px;">
                <span><b>${teamLabel}</b> vs ${d ? d.opponents : ''}</span>
                <span style="color:${m.isDraw?'var(--text-dim)':(d && d.won?'var(--green)':'var(--red)')};">${m.isDraw?'DRAW':(d && d.won?'WIN':'LOSS')}</span>
              </div>
              <div style="margin-top:2px; color:var(--text-dim); font-size:11px;">${e.date} · ${m.score}</div>
              <div style="margin-top:4px;"><span class="${deltaClass}" style="font-weight:700;">${deltaLabel} pts</span> <span style="color:var(--text-dim); font-size:11px;">→ ${Math.round(e.rating)}</span></div>
              ${!isExpanded ? `<div style="margin-top:2px; color:var(--text-dim); font-size:10px;">tap for this game's full breakdown</div>` : ''}
              ${detailContent}
            </div>
          </div>`;
        });
      }
    });
  }

  // Both lists come from the shared selectors, which include drawn games.
  // They were built here from `MATCHES` -- the RATED set -- so a drawn meeting
  // was not a meeting at all: two players who had drawn once and never
  // otherwise met were told they had never played each other.
  const inMonth = (m) => !monthActive || m.date.slice(0,7) === h2hMonth;
  const opponentMatches = h2hOpponentMatches(h2hPlayerA, h2hPlayerB)
    .filter(inMonth).sort((a,b)=> a.date < b.date ? 1 : -1);
  const teammateMatches = h2hTeammateMatches(h2hPlayerA, h2hPlayerB)
    .filter(inMonth).sort((a,b)=> a.date < b.date ? 1 : -1);

  const headToHead = MatchOutcome.tally(opponentMatches, h2hPlayerA);
  const aWins = headToHead.wins;
  const bWins = headToHead.losses;   // A's losses as opponents ARE B's wins
  const h2hDraws = headToHead.draws;

  html += `<div class="section-heading" style="margin-top:6px;">⚔️ As opponents${monthActive ? ` (${monthLabel(h2hMonth)})` : ''}</div>`;
  if(opponentMatches.length === 0){
    html += `<div class="section-sub">${h2hPlayerA} and ${h2hPlayerB} ${monthActive ? `didn't play each other in ${monthLabel(h2hMonth)}` : 'have never played against each other'}.</div>`;
  } else {
    html += `<div class="matchup-vs" style="text-align:center; font-size:16px; padding:12px;">
      <b style="color:${aWins>bWins?'var(--gold-bright)':'var(--text)'};">${h2hPlayerA} ${aWins}</b>
      <span style="color:var(--text-dim); margin:0 6px;">–</span>${h2hDraws ? `<span style="color:var(--text-dim); font-size:13px;">${h2hDraws} drawn</span><span style="color:var(--text-dim); margin:0 6px;">–</span>` : ''}
      <b style="color:${bWins>aWins?'var(--gold-bright)':'var(--text)'};">${bWins} ${h2hPlayerB}</b>
      <div style="font-size:11px; color:var(--text-dim); margin-top:4px;">${opponentMatches.length} meeting${opponentMatches.length===1?'':'s'} as opponents</div>
    </div>`;
    opponentMatches.forEach(m=>{
      const sidesA = MatchOutcome.sidesFor(m, h2hPlayerA);
      const drew = sidesA.outcome === MatchOutcome.DRAW;
      const aWon = sidesA.outcome === MatchOutcome.WIN;
      const aPartner = sidesA.mine.filter(n=>n!==h2hPlayerA)[0];
      const bPartner = sidesA.theirs.filter(n=>n!==h2hPlayerB)[0];
      const adminButtons = isUnlocked
        ? `<div class="section-sub" style="margin-top:8px; font-size:10.5px;">To correct or remove this game, open it in the Games tab.</div>`
        : '';
      // "X won" is not a thing that happened in a drawn match, and saying it
      // of whichever side the record filed first is how this screen used to
      // hand one player a win and the other a loss out of a coin toss.
      const title = drew
        ? `${h2hPlayerA} and ${h2hPlayerB} drew`
        : `${aWon ? h2hPlayerA : h2hPlayerB} won`;
      const titleColour = drew ? 'var(--text-dim)' : (aWon ? 'var(--green)' : 'var(--red)');
      html += `<div class="callout-card">
        <div class="cc-title" style="color:${titleColour};">${escapeHtml(title)}</div>
        <div class="cc-detail">${m.date} · ${aPartner?`${h2hPlayerA} &amp; ${aPartner}`:h2hPlayerA} vs ${bPartner?`${h2hPlayerB} &amp; ${bPartner}`:h2hPlayerB}<br/>${m.score}</div>
        ${adminButtons}
      </div>`;
    });
  }

  html += `<div class="section-heading">🤝 As teammates${monthActive ? ` (${monthLabel(h2hMonth)})` : ''}</div>`;
  if(teammateMatches.length === 0){
    html += `<div class="section-sub">${h2hPlayerA} and ${h2hPlayerB} ${monthActive ? `didn't play together in ${monthLabel(h2hMonth)}` : 'have never partnered together'}.</div>`;
  } else {
    // `losses = total - wins` is the shape that cannot hold a draw, and it
    // filed every drawn game as a defeat for the pair.
    const together = MatchOutcome.tally(teammateMatches, h2hPlayerA);
    const partnership = PARTNERSHIPS.find(p=> p.pair.includes(h2hPlayerA) && p.pair.includes(h2hPlayerB));
    html += `<div class="matchup-vs" style="padding:10px;">
      <b>${together.wins}-${together.losses}${together.draws ? `-${together.draws}` : ''}</b> together${together.draws ? ` <span style="color:var(--text-dim); font-size:11px;">(W-L-D)</span>` : ''}${partnership ? ` · <span class="${partnership.avg_overperf>3?'perf-pos':(partnership.avg_overperf<-3?'perf-neg':'')}">${partnership.avg_overperf>=0?'+':''}${partnership.avg_overperf}% chemistry</span>` : ''}
    </div>`;
    teammateMatches.forEach(m=>{
      const sides = MatchOutcome.sidesFor(m, h2hPlayerA);
      const oppTeam = sides.theirs;
      const adminButtons = isUnlocked
        ? `<div class="section-sub" style="margin-top:8px; font-size:10.5px;">To correct or remove this game, open it in the Games tab.</div>`
        : '';
      html += `<div class="callout-card">
        <div class="cc-title" style="color:${sides.outcome===MatchOutcome.DRAW?'var(--text-dim)':(sides.outcome===MatchOutcome.WIN?'var(--green)':'var(--red)')};">${sides.outcome===MatchOutcome.DRAW?'DRAW':(sides.outcome===MatchOutcome.WIN?'WIN':'LOSS')}</div>
        <div class="cc-detail">${m.date} · vs ${oppTeam.join(' &amp; ')}<br/>${m.score}</div>
        ${adminButtons}
      </div>`;
    });
  }

  box.innerHTML = html;

  box.querySelectorAll('.h2h-edit-btn').forEach(btn=>{
    btn.onclick = ()=> navigateToGamesTabForEdit(btn.dataset.matchId);
  });
  box.querySelectorAll('.h2h-delete-btn').forEach(btn=>{
    btn.onclick = async ()=>{
      const id = btn.dataset.matchId;
      if(armedDeleteId === id){ await deleteMatch(id); renderH2H(); }
      else { armedDeleteId = id; renderH2H(); }
    };
  });
  box.querySelectorAll('.h2h-month-game').forEach(el=>{
    el.onclick = (ev)=>{
      if(ev.target.closest && ev.target.closest('details')) return; // see the note in renderGamesTab
      const id = el.dataset.gameid;
      expandedGameId = (expandedGameId === id) ? null : id;
      renderH2H();
    };
  });
  wireH2HSelects(names);

  populateMonthSelect(document.getElementById('h2hMonthSelect'), h2hMonth);
  document.getElementById('h2hMonthSelect').addEventListener('change', e=>{
    h2hMonth = e.target.value;
    renderH2H();
  });
}

function wireH2HSelects(names){
  const selA = document.getElementById('h2hSelectA');
  const selB = document.getElementById('h2hSelectB');
  selA.innerHTML = names.map(n=>`<option value="${n}" ${n===h2hPlayerA?'selected':''}>${n}</option>`).join('');
  selB.innerHTML = names.map(n=>`<option value="${n}" ${n===h2hPlayerB?'selected':''}>${n}</option>`).join('');
  selA.addEventListener('change', e=>{ h2hPlayerA = e.target.value; renderH2H(); });
  selB.addEventListener('change', e=>{ h2hPlayerB = e.target.value; renderH2H(); });
}

// ===================== WISHLIST / UPCOMING GAME REQUESTS =====================
function fmtRequestConfirmations(req){
  const confirmedCount = req.players.filter(n=>req.confirmations[n]).length;
  const pillClass = confirmedCount === req.players.length ? 'perf-pos' : '';
  return `<div style="margin-top:6px; font-size:11.5px;">
    <span class="${pillClass}" style="font-weight:700;">${confirmedCount}/${req.players.length} confirmed</span>
    <div style="margin-top:4px; color:var(--text-dim);">
      ${req.players.map(n=> `${req.confirmations[n] ? '✅' : '⬜'} <span class="request-player-link" data-player="${n}" style="text-decoration:underline; cursor:pointer; color:var(--text);">${n}</span>`).join(' &nbsp; ')}
    </div>
  </div>`;
}

// Which Upcoming cards have their prediction open. Not persisted, and keyed by
// request id so opening one does not open the rest.
let upcomingPredictionOpen = {};

// Which sections of Requests and Upcoming are open. Both screens were a single
// scroll of stacked forms with the actual content at the bottom, which on a
// phone meant the list of open requests was below three form panels nobody had
// asked for. The lists open; the forms that create them do not. Not persisted:
// each screen should open the same way every time.
let requestSectionOpen = { challenges: true, forMe: true, mine: true, request: false, bulk: false, adminAdd: false, others: false };
let upcomingSectionOpen = { review: true, attention: true, upcoming: true, calledOut: true, archived: false };

// ===================== FIXTURES: REQUESTS AND UPCOMING =====================
// The rules live in fixtureFlow.js; this draws them and wires the taps.
//
//   - A player responds for themselves only -- the actor is always the player
//     selected on this device (getCurrentViewer). There is no control that
//     acts for anyone else.
//   - Only a participant sees "I'm in" / "Can't play". Nobody else sees a
//     withdrawal or removal control.
//   - Admin maintenance -- players, sides, answers, date, time, venue, court
//     booking and, last, removal -- lives in one "Manage fixture" panel.
//     Removal takes a second, explicit tap.
//   - An agreed fixture is listed by stage (FixtureFlow.stage): Needs
//     attention, Upcoming (court booked) or Called Out (not booked yet).

// Which fixture cards are open. Folded by default; emptied on arrival.
let upcomingOpen = new Set();
// The fixture whose Manage panel is open, and what its last save said.
let fixtureManageOpen = null;
let fixtureManageMessage = '';
// The fixture an admin has asked to remove but not yet confirmed.
let fixtureRemoveArmed = null;
let fixtureFlashMessage = '';

// What a refused change says, in the club's words.
const FIXTURE_REFUSALS = {
  'not-participant': 'Only the players in this game can answer for it.',
  'not-admin': 'Only an admin can change a fixture.',
  'closed': 'This fixture is no longer open.',
  'missing-player': 'Every seat needs a player.',
  'duplicate-player': 'The same player is in two seats.',
  'already-playing': 'That player is already in this game.',
  'archived': 'This call-out is archived — an admin can restore it.',
  'not-called-out': 'Only an active Called Out game can be archived.',
  'not-archived': 'This game is not archived.',
};

function fixtureActor(){
  const v = (typeof getCurrentViewer === 'function') ? getCurrentViewer() : null;
  return v ? v.name : null;
}
function fixtureAdminName(){
  return (currentUserName && currentUserName.trim()) || fixtureActor() || 'Admin';
}
function localIsoToday(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
// "Tue 29 Sep" -- how the club says a date.
function fmtFixtureDate(iso){
  if(!iso) return '';
  const d = new Date(iso + 'T12:00:00Z');
  if(isNaN(d)) return iso;
  // By hand: locales disagree ("Fri, 18 Sept"), and this is the club's form.
  const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getUTCDay()];
  const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()];
  return `${day} ${d.getUTCDate()} ${month}`;
}

function fixtureLink(n){
  return `<span class="request-player-link" data-player="${escapeHtml(n)}">${escapeHtml(n)}</span>`;
}

// The two sides, linked, or the four names when no sides were agreed.
function fixtureTeamsHtml(req){
  const [sideA, sideB] = requestTeams(req);
  return (sideA.length && sideB.length)
    ? `${sideA.map(fixtureLink).join(' &amp; ')} <span class="fx-vs">vs</span> ${sideB.map(fixtureLink).join(' &amp; ')}`
    : req.players.map(fixtureLink).join(' &amp; ');
}

// Date, time and venue in a line, with TBC where nothing is set. A Called Out
// game's details are only a proposal, and the line says so.
function fixtureWhenText(req){
  const bits = [req.preferredDate ? fmtFixtureDate(req.preferredDate) : 'Date TBC'];
  if(req.preferredTime) bits.push(req.preferredTime);
  bits.push(req.location || 'Venue TBC');
  return bits.join(' · ');
}

// Why an agreed fixture needs attention, in a phrase.
function fixtureAttentionText(req){
  const a = FixtureFlow.attention(req);
  const parts = [];
  if(a.backedOut.length) parts.push(`${a.backedOut.join(', ')} backed out`);
  if(a.waiting.length) parts.push(`waiting on ${a.waiting.join(', ')}`);
  return parts.join(' · ');
}

// Each player and where they stand: in, backed out, or not answered yet.
function fixturePlayersHtml(req){
  const cant = req.cantPlay || {};
  const agreed = FixtureFlow.isAgreed(req);
  return `<div class="fx-players">${req.players.map(n => {
    const state = cant[n] ? 'cant' : ((req.confirmations || {})[n] ? 'in' : 'waiting');
    const icon = state === 'in' ? '✅' : state === 'cant' ? '✖' : '⬜';
    const label = state === 'in' ? 'in'
      : state === 'cant' ? `${agreed ? 'backed out' : "can't play"} · ${fmtRelative(cant[n].at)}`
      : (agreed ? 'awaiting confirmation' : 'not answered');
    return `<div class="fx-player fx-state-${state}">${icon} ${fixtureLink(n)} <span class="fx-player-state">${label}</span></div>`;
  }).join('')}</div>`;
}

// What the selected player can do about this fixture -- for themselves.
function fixtureViewerActionsHtml(req){
  const me = FixtureFlow.participantName(req, fixtureActor());
  if(!me || !FixtureFlow.isOpen(req)) return '';
  const inNow = !!(req.confirmations || {})[me];
  const cantNow = !!(req.cantPlay || {})[me];
  const agreed = FixtureFlow.isAgreed(req);
  const btn = (response, label, cls) => `<button type="button" class="preset-btn fx-respond ${cls}" data-fixture-id="${escapeHtml(req.id)}" data-response="${response}">${label}</button>`;
  let body;
  if(!inNow && !cantNow) body = btn('in', "I'm in", 'fx-in') + btn('cant', "Can't play", 'fx-cant');
  else if(inNow) body = `<span class="fx-you">You're in</span>` + btn('cant', agreed ? "I can't play" : "Can't play", 'fx-cant');
  else body = `<span class="fx-you fx-you-cant">You said you can't play</span>` + btn('in', "I'm in after all", 'fx-in');
  return `<div class="fx-actions">${body}</div>`;
}

// Admin removal: two steps, inside Manage fixture, and never shown to a player.
function fixtureAdminRemoveHtml(req){
  if(!isUnlocked || !FixtureFlow.isOpen(req)) return '';
  const id = escapeHtml(req.id);
  if(fixtureRemoveArmed === req.id){
    return `<div class="fx-remove-confirm">
      <div>Remove this fixture for everyone? It leaves ${FixtureFlow.isAgreed(req) ? 'the Upcoming tab' : 'Requests'}; its history is kept.</div>
      <div class="difficulty-row" style="margin-top:8px;">
        <button type="button" class="preset-btn fx-remove-yes" data-fixture-id="${id}" style="flex:1;">Remove fixture</button>
        <button type="button" class="preset-btn fx-remove-no" data-fixture-id="${id}" style="flex:1;">Keep it</button>
      </div>
    </div>`;
  }
  return `<button type="button" class="lg-inline-fold fx-remove-arm" data-fixture-id="${id}">Remove fixture…</button>`;
}

// Manage fixture: the admin's one place to maintain a fixture -- players and
// sides, each player's answer, date, time, venue and the court booking -- and,
// set apart at the bottom, removing it. Every save edits this fixture; none
// makes a new one.
function fixtureManageHtml(req){
  if(!isUnlocked || !FixtureFlow.isOpen(req)) return '';
  const id = escapeHtml(req.id);
  const open = fixtureManageOpen === req.id;
  let html = `<button type="button" class="lg-inline-fold fx-manage-toggle" data-fixture-id="${id}" aria-expanded="${open}" aria-controls="fxManage_${id}">
      Manage fixture<span class="lg-inline-chev" aria-hidden="true">${open ? '⌄' : '›'}</span>
    </button>`;
  if(!open) return html;
  const seatList = FixtureFlow.seats(req);
  const size = Math.floor(seatList.length / 2);
  const names = allPlayerNames();
  const seatRow = (n, i) => {
    const options = (names.includes(n) ? names : [n, ...names])
      .map(x => `<option value="${escapeHtml(x)}"${x === n ? ' selected' : ''}>${escapeHtml(x)}</option>`).join('');
    const st = FixtureFlow.availabilityOf(req, n);
    const stOpt = (v, label) => `<option value="${v}"${st === v ? ' selected' : ''}>${label}</option>`;
    return `<div class="fx-m-seat-row">
      <select class="fg-select fx-m-seat" data-seat="${i}" data-original="${escapeHtml(n)}" aria-label="Player ${i + 1}">${options}</select>
      <select class="fg-select fx-m-state" data-seat="${i}" aria-label="Player ${i + 1} answer">${stOpt('in', 'In')}${stOpt('waiting', 'Not answered')}${stOpt('out', 'Backed out')}</select>
    </div>`;
  };
  const booked = req.courtBookingMade === true;
  const recorded = FixtureFlow.bookingRecorded(req);
  const answers = Object.fromEntries(req.players.map(n => [n, FixtureFlow.availabilityOf(req, n)]));
  html += `<div class="fx-manage" id="fxManage_${id}" data-fixture-id="${id}" data-answers="${escapeHtml(JSON.stringify(answers))}">
    <div class="fx-m-label">Side A</div>
    ${seatList.slice(0, size).map((n, i) => seatRow(n, i)).join('')}
    <div class="fx-m-label">Side B</div>
    ${seatList.slice(size).map((n, i) => seatRow(n, i + size)).join('')}
    <div class="fx-m-hint" hidden>A new player starts as not answered — they confirm for themselves.</div>
    <div class="fx-m-grid">
      <label class="fx-m-field"><span class="fx-m-label">Date</span><input type="date" class="fg-select fx-m-date" value="${escapeHtml(req.preferredDate || '')}"></label>
      <label class="fx-m-field"><span class="fx-m-label">Time</span><input type="time" class="fg-select fx-m-time" value="${escapeHtml(req.preferredTime || '')}"></label>
    </div>
    <label class="fx-m-field"><span class="fx-m-label">Venue</span><input class="fg-select fx-m-venue" value="${escapeHtml(req.location || '')}" placeholder="Court or venue"></label>
    <label class="fx-m-booking">
      <input type="checkbox" class="fx-m-booked" data-initial="${recorded ? String(booked) : 'unset'}"${booked ? ' checked' : ''}>
      <span><b>Court booking made</b><br><span class="fx-m-sub">Marks this game as booked and moves it to Upcoming.${recorded ? '' : ' Not recorded for this game yet.'}</span></span>
    </label>
    ${fixtureManageMessage ? `<div class="fx-note fx-note-attn">${escapeHtml(fixtureManageMessage)}</div>` : ''}
    <div class="fx-actions">
      <button type="button" class="preset-btn fx-m-save" data-fixture-id="${id}">Save changes</button>
      <button type="button" class="preset-btn fx-m-cancel" data-fixture-id="${id}">Cancel</button>
    </div>
    ${fixtureArchiveControlHtml(req)}
    <div class="fx-m-danger">${fixtureAdminRemoveHtml(req)}</div>
  </div>`;
  return html;
}

// Archive call-out / Restore to Called Out: a state change on the same
// fixture, never a copy. Offered only where it applies.
function fixtureArchiveControlHtml(req){
  const st = FixtureFlow.stage(req, new Date().toISOString());
  const id = escapeHtml(req.id);
  if(st === FixtureFlow.STAGE.CALLED_OUT){
    return `<div class="fx-m-archive"><button type="button" class="preset-btn fx-archive" data-fixture-id="${id}">Archive call-out</button>
      <div class="fx-m-sub">Takes it off the active list. Nothing is deleted; it can be restored.</div></div>`;
  }
  if(st === FixtureFlow.STAGE.ARCHIVED){
    return `<div class="fx-m-archive"><button type="button" class="preset-btn fx-in fx-restore" data-fixture-id="${id}">Restore to Called Out</button>
      <div class="fx-m-sub">Back on the active list for another ${FixtureFlow.ARCHIVE_DAYS} days.</div></div>`;
  }
  return '';
}

// A recorded result, said the way the Games list says it.
function fixtureResultLine(m){
  const score = (m.sets && m.sets.length) ? m.sets.map(([a,b]) => `${a}-${b}`).join(', ') : '';
  const verb = m.isDraw ? 'drew with' : 'def';
  return `${escapeHtml(m.date)} · ${m.winners.map(escapeHtml).join(' &amp; ')} ${verb} ${m.losers.map(escapeHtml).join(' &amp; ')}${score ? ' · ' + escapeHtml(score) : ''}`;
}

// What an agreed fixture is called where it is listed.
function fixtureStageWord(req){
  const s = FixtureFlow.stage(req);
  return s === FixtureFlow.STAGE.UPCOMING ? 'Upcoming game' : s === FixtureFlow.STAGE.CALLED_OUT ? 'Called Out game'
    : s === FixtureFlow.STAGE.ARCHIVED ? 'archived call-out' : 'game';
}

// Admin, on an agreed fixture that may already have been played: the recorded
// results that could be it, and a human decision. Nothing here runs on its
// own -- a fixture only closes when one of these buttons is pressed.
function fixtureReconcileHtml(req, ctx){
  if(!isUnlocked || !FixtureFlow.isAgreed(req)) return '';
  const cands = FixtureFlow.candidatesForFixture(req, ctx.results, { canon: playerIdFor, linkedResultIds: ctx.linked });
  if(!cands.length) return '';
  const id = escapeHtml(req.id);
  const word = fixtureStageWord(req);
  return `<div class="fx-reconcile">
    <div class="fx-reconcile-q">Does ${cands.length === 1 ? 'this recorded result' : 'one of these recorded results'} belong to this ${word}?</div>
    ${cands.map(c => `<div class="fx-reconcile-row">
      <div class="fx-reconcile-label">Result recorded</div>
      <div>${fixtureResultLine(c.result)}</div>
      <div class="fx-reconcile-why">${c.reasons.map(escapeHtml).join(' · ')}</div>
      <button type="button" class="preset-btn fx-reconcile-yes" data-fixture-id="${id}" data-result-id="${escapeHtml(c.result.id)}">This was the game</button>
    </div>`).join('')}
    <button type="button" class="preset-btn fx-reconcile-no" data-fixture-id="${id}" data-result-ids="${escapeHtml(cands.map(c => c.result.id).join(','))}">${cands.length === 1 ? `${word[0].toUpperCase() + word.slice(1)} is still outstanding` : 'None — still outstanding'}</button>
  </div>`;
}

// An unconfirmed request, as Play > Requests shows it.
function buildPendingRequestCardHtml(req){
  const attention = FixtureFlow.cantPlayers(req);
  return `<div class="callout-card fx-card${attention.length ? ' fx-attn' : ''}" data-fixture-id="${escapeHtml(req.id)}">
    <div class="cc-title">${fixtureTeamsHtml(req)}</div>
    <div class="cc-detail">${requestWhenHtml(req, { tbc: false })}requested by ${escapeHtml(req.requestedBy)} (${fmtRelative(req.requestedAt)})</div>
    <div class="fx-count">${FixtureFlow.confirmedCount(req)}/${req.players.length} confirmed${attention.length ? ` · <span class="fx-tag fx-tag-attn">Needs attention</span>` : ''}</div>
    ${fixturePlayersHtml(req)}
    ${fixtureViewerActionsHtml(req)}
    ${fixtureManageHtml(req)}
  </div>`;
}

// An agreed fixture -- Upcoming, Called Out or Needs attention: one line to
// scan when folded, everything when open.
function buildUpcomingCardHtml(req, ctx){
  const open = upcomingOpen.has(req.id);
  const now = ctx.now || new Date().toISOString();
  const stage = FixtureFlow.stage(req, now);
  const S = FixtureFlow.STAGE;
  const archive = stage === S.ARCHIVED ? FixtureFlow.archiveInfo(req, now) : null;
  const booked = FixtureFlow.isBooked(req);
  const sum = FixtureFlow.summaryLine(req, requestTeams);
  const submitted = ctx.submittedFor.has(req.id);
  const past = !!req.preferredDate && req.preferredDate < ctx.today;
  const n = req.players.length;
  const id = escapeHtml(req.id);

  // Line two of the folded card: where the fixture stands.
  const status = [];
  if(stage === S.ATTENTION){
    status.push(`<span class="fx-tag fx-tag-attn">Needs attention</span> ${escapeHtml(fixtureAttentionText(req))}`);
    status.push(booked ? 'Court booked' : 'Court not booked');
  } else if(stage === S.UPCOMING){
    status.push(`${FixtureFlow.confirmedCount(req)}/${n} confirmed`, 'Court booked');
  } else if(archive){
    status.push(`Archived ${fmtRelative(archive.at)}`, archive.auto ? `after ${FixtureFlow.ARCHIVE_DAYS} days unbooked` : `by ${escapeHtml(archive.by)}`);
  } else {
    status.push(`${FixtureFlow.confirmedCount(req)}/${n} agreed`, 'Court not booked',
      req.restoredAt ? `Restored ${fmtRelative(req.restoredAt)}` : `Called out ${fmtRelative(FixtureFlow.activeSince(req))}`);
  }
  const tags = [];
  if(submitted) tags.push(`<span class="fx-tag">Result submitted</span>`);
  else if(past) tags.push(`<span class="fx-tag fx-tag-past">Date passed</span>`);
  if(isUnlocked && !FixtureFlow.bookingRecorded(req)) tags.push(`<span class="fx-tag fx-tag-past">Booking not recorded</span>`);
  const proposed = !booked;

  let html = `<div class="callout-card fx-card fx-upcoming fx-stage-${stage}${stage === S.ATTENTION ? ' fx-attn' : ''}${open ? ' is-open' : ''}" data-fixture-id="${id}">
    <button type="button" class="fx-head" data-fixture-id="${id}" aria-expanded="${open}" aria-controls="fxBody_${id}">
      <span class="fx-head-text">
        <span class="fx-title">${escapeHtml(sum.title)}</span>
        <span class="fx-meta">${proposed ? 'Proposed: ' : ''}${escapeHtml(fixtureWhenText(req))}</span>
        <span class="fx-meta">${status.join(' · ')}${tags.length ? ' ' + tags.join(' ') : ''}</span>
      </span>
      <span class="fx-chev" aria-hidden="true">${open ? '⌄' : '›'}</span>
    </button>`;
  if(open){
    html += `<div class="fx-body" id="fxBody_${id}">
      <div class="cc-title">${fixtureTeamsHtml(req)}</div>
      <div class="cc-detail">${proposed ? 'Proposed: ' : ''}${escapeHtml(fixtureWhenText(req))} · requested by ${escapeHtml(req.requestedBy)} (${fmtRelative(req.requestedAt)})</div>
      <div class="fx-court ${booked ? 'fx-court-yes' : 'fx-court-no'}">${booked ? 'Court booked' : 'Court not booked yet'}</div>
      ${fixturePlayersHtml(req)}
      ${stage === S.ATTENTION ? `<div class="fx-note fx-note-attn">${escapeHtml(fixtureAttentionText(req))} — this game needs sorting out${booked ? ', and a court is booked' : ''}.</div>` : ''}
      ${archive ? `<div class="fx-note">Archived ${archive.auto ? `automatically, ${FixtureFlow.ARCHIVE_DAYS} days after it was ${req.restoredAt ? 'restored' : 'called out'} without a court booking` : `by ${escapeHtml(archive.by)}`}. Not cancelled and not deleted — first called out ${escapeHtml(fmtFixtureDate(FixtureFlow.calledOutAt(req).slice(0, 10)))}.${isUnlocked ? ' Restore it from Manage fixture.' : ''}</div>` : ''}
      ${submitted ? `<div class="fx-note">A result has been submitted from this game and is waiting for an admin to approve it.</div>`
        : (past ? `<div class="fx-note">The date has passed and no result is linked to this game yet.</div>` : '')}
      <div class="fx-actions">
        ${submitted ? '' : `<button type="button" class="preset-btn request-addresult-btn" data-request-id="${id}">Add result</button>`}
      </div>
      ${archive ? '' : fixtureViewerActionsHtml(req)}
      ${upcomingPredictionHtml(req)}
      ${fixtureReconcileHtml(req, ctx)}
      ${fixtureManageHtml(req)}
    </div>`;
  }
  return html + `</div>`;
}

// Admin-only, and gated on `isUnlocked` at the moment the card is built -- a
// prediction is a view on how the club rates its players and is not for
// general circulation through the Upcoming list.
function upcomingPredictionHtml(req){
  if(!isUnlocked) return '';
  const [sideA, sideB] = requestTeams(req);
  const open = !!upcomingPredictionOpen[req.id];
  const pred = predictMatchup(sideA, sideB);
  if(!pred.ok) return '';
  return `<button type="button" class="lg-inline-fold request-pred-toggle" data-request-id="${escapeHtml(req.id)}"
      aria-expanded="${open}" aria-controls="pred_${escapeHtml(req.id)}">
      ${open ? 'Hide prediction' : 'Prediction available'}<span class="lg-inline-chev" aria-hidden="true">${open ? '⌄' : '›'}</span>
    </button>`
    + (open ? `<div class="lg-inline-body" id="pred_${escapeHtml(req.id)}">${
        matchPredictionHtml(pred, { foot: 'Based on current Power Ratings · Admin only · Nothing is recorded.' })
      }</div>` : '');
}

// One wiring for the prediction fold, wherever a card is drawn.
function wireRequestPredictions(box){
  box.querySelectorAll('.request-pred-toggle').forEach(btn=>{
    btn.onclick = ()=>{
      const id = btn.dataset.requestId;
      upcomingPredictionOpen[id] = !upcomingPredictionOpen[id];
      renderUpcoming();
    };
  });
}

// Apply one fixture change and store it. The change is made through
// FixtureFlow, which refuses anything the actor may not do; a failed save
// puts every fixture back as it was.
async function commitFixtureChange(change){
  const before = JSON.stringify(gameRequestsState);
  const result = change();
  if(!result || !result.ok){
    gameRequestsState = JSON.parse(before);
    fixtureFlashMessage = (result && FIXTURE_REFUSALS[result.reason]) || '';
    dataChanged();
    return result;
  }
  const ok = await saveGameRequests(gameRequestsState);
  if(!ok){
    gameRequestsState = JSON.parse(before);
    fixtureFlashMessage = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage.`;
  } else {
    fixtureFlashMessage = '';
  }
  dataChanged();
  return Object.assign({}, result, { saved: ok });
}

// Every fixture control, on whichever screen drew it.
function wireFixtureControls(box){
  const find = (id) => gameRequestsState.find(r => r.id === id);
  box.querySelectorAll('.fx-head').forEach(btn=>{
    btn.onclick = ()=>{
      const id = btn.dataset.fixtureId;
      if(upcomingOpen.has(id)) upcomingOpen.delete(id); else upcomingOpen.add(id);
      renderUpcoming();
    };
  });
  box.querySelectorAll('.fx-respond').forEach(btn=>{
    btn.onclick = async ()=>{
      const req = find(btn.dataset.fixtureId);
      const actor = fixtureActor();
      if(!req || !actor) return;
      await commitFixtureChange(()=> FixtureFlow.respond(req, actor, btn.dataset.response));
    };
  });
  box.querySelectorAll('.fx-manage-toggle').forEach(btn=>{
    btn.onclick = ()=>{
      const id = btn.dataset.fixtureId;
      fixtureManageOpen = fixtureManageOpen === id ? null : id;
      fixtureManageMessage = '';
      fixtureRemoveArmed = null;
      renderActiveTab();
    };
  });
  // A seat's answer follows its player. Someone already in the game keeps
  // theirs when moved to another seat; a new name starts unanswered, whatever
  // the player they replace had said.
  box.querySelectorAll('.fx-m-seat').forEach(sel=>{
    sel.onchange = ()=>{
      const panel = sel.closest('.fx-manage');
      const answers = JSON.parse(panel.dataset.answers || '{}');
      const state = panel.querySelector(`.fx-m-state[data-seat="${sel.dataset.seat}"]`);
      if(state) state.value = answers[sel.value] || 'waiting';
      const hint = panel.querySelector('.fx-m-hint');
      if(hint) hint.hidden = ![...panel.querySelectorAll('.fx-m-seat')].some(s => !(s.value in answers));
    };
  });
  box.querySelectorAll('.fx-m-cancel').forEach(btn=>{
    btn.onclick = ()=>{ fixtureManageOpen = null; fixtureManageMessage = ''; fixtureRemoveArmed = null; renderActiveTab(); };
  });
  box.querySelectorAll('.fx-m-save').forEach(btn=>{
    btn.onclick = async ()=>{
      const req = find(btn.dataset.fixtureId);
      const panel = btn.closest('.fx-manage');
      if(!req || !panel) return;
      const seatsNow = [...panel.querySelectorAll('.fx-m-seat')].map(s => s.value);
      const availability = {};
      panel.querySelectorAll('.fx-m-state').forEach(s => { availability[seatsNow[+s.dataset.seat]] = s.value; });
      const booking = panel.querySelector('.fx-m-booked');
      const edit = {
        seats: seatsNow, availability,
        date: panel.querySelector('.fx-m-date').value,
        time: panel.querySelector('.fx-m-time').value,
        venue: panel.querySelector('.fx-m-venue').value,
      };
      // Left unrecorded unless the admin actually answered it.
      if(!(booking.dataset.initial === 'unset' && !booking.checked)) edit.courtBookingMade = booking.checked;
      const result = await commitFixtureChange(()=> FixtureFlow.adminEdit(req, edit, { isAdmin: isUnlocked, by: fixtureAdminName(), canon: playerIdFor }));
      if(result && result.ok && result.saved){
        fixtureManageOpen = null; fixtureManageMessage = '';
        fixtureFlashMessage = result.changes ? 'Fixture updated.' : 'Nothing changed.';
      } else {
        fixtureManageMessage = fixtureFlashMessage || 'Nothing was saved.';
      }
      renderActiveTab();
    };
  });
  box.querySelectorAll('.fx-archive').forEach(btn=>{
    btn.onclick = async ()=>{
      const req = find(btn.dataset.fixtureId);
      if(!req) return;
      fixtureManageOpen = null;
      const r = await commitFixtureChange(()=> FixtureFlow.archiveCallOut(req, { isAdmin: isUnlocked, by: fixtureAdminName() }));
      if(r && r.ok && r.saved){ fixtureFlashMessage = 'Archived. It is under Archived call-outs, and can be restored.'; renderActiveTab(); }
    };
  });
  box.querySelectorAll('.fx-restore').forEach(btn=>{
    btn.onclick = async ()=>{
      const req = find(btn.dataset.fixtureId);
      if(!req) return;
      fixtureManageOpen = null;
      const r = await commitFixtureChange(()=> FixtureFlow.restoreCallOut(req, { isAdmin: isUnlocked, by: fixtureAdminName() }));
      if(r && r.ok && r.saved){ fixtureFlashMessage = `Restored to Called Out for another ${FixtureFlow.ARCHIVE_DAYS} days.`; renderActiveTab(); }
    };
  });
  box.querySelectorAll('.fx-book-set').forEach(btn=>{
    btn.onclick = async ()=>{
      const req = find(btn.dataset.fixtureId);
      if(!req) return;
      await commitFixtureChange(()=> FixtureFlow.setCourtBooking(req, { isAdmin: isUnlocked, booked: btn.dataset.booked === 'true', by: fixtureAdminName() }));
    };
  });
  box.querySelectorAll('.fx-remove-arm').forEach(btn=>{
    btn.onclick = ()=>{ fixtureRemoveArmed = btn.dataset.fixtureId; renderActiveTab(); };
  });
  box.querySelectorAll('.fx-remove-no').forEach(btn=>{
    btn.onclick = ()=>{ fixtureRemoveArmed = null; renderActiveTab(); };
  });
  box.querySelectorAll('.fx-remove-yes').forEach(btn=>{
    btn.onclick = async ()=>{
      const req = find(btn.dataset.fixtureId);
      if(!req || fixtureRemoveArmed !== req.id) return;
      fixtureRemoveArmed = null;
      fixtureManageOpen = null;
      await commitFixtureChange(()=> FixtureFlow.adminRemove(req, { isAdmin: isUnlocked, confirmed: true, by: fixtureAdminName() }));
    };
  });
  box.querySelectorAll('.fx-reconcile-yes').forEach(btn=>{
    btn.onclick = async ()=>{
      const req = find(btn.dataset.fixtureId);
      if(!req) return;
      await commitFixtureChange(()=> FixtureFlow.reconcile(req, { isAdmin: isUnlocked, resultId: btn.dataset.resultId, by: fixtureAdminName() }));
    };
  });
  box.querySelectorAll('.fx-reconcile-no').forEach(btn=>{
    btn.onclick = async ()=>{
      const req = find(btn.dataset.fixtureId);
      if(!req) return;
      const ids = (btn.dataset.resultIds || '').split(',').filter(Boolean);
      await commitFixtureChange(()=>{
        let last = { ok: false };
        ids.forEach(resultId => { last = FixtureFlow.keepOutstanding(req, { isAdmin: isUnlocked, resultId, by: fixtureAdminName() }); });
        return last;
      });
    };
  });
}

// ===================== PREDICTION: THE ONE CALCULATION, THE ONE CARD =====
// Both screens that show a prediction -- Admin's Predict a Matchup and an
// agreed game in Upcoming -- go through these two functions. The calculation
// is in `matchPrediction.js`; this is the application's side of it: finding a
// player's rating, and saying the answer in the words the club agreed.

// The prediction currently on screen in Admin, kept so it can be turned into
// an Upcoming game without naming the same four players again.
let predictionDraft = null;

// How an Upcoming game's players divide into sides.
//
// `players` is a flat list of four and has been since the wishlist was
// written, with everything downstream -- confirmations, the card, relevance --
// built on that shape. Splitting it 0,1 vs 2,3 is the convention the Add
// result bridge has always used, so it stays the fallback. `teams` is an
// optional, additive field for a game whose sides are actually known, which is
// every game created from a prediction: the whole point of predicting Manny &
// Del against Kaz & Erf is that those are the pairs. It also makes a singles
// game expressible, which the flat split silently could not -- two names would
// have gone in as a single partnership.
function requestTeams(req){
  if(req && Array.isArray(req.teams) && req.teams.length === 2
     && (req.teams[0] || []).length && (req.teams[1] || []).length){
    return [req.teams[0].slice(), req.teams[1].slice()];
  }
  const p = (req && req.players) || [];
  return [p.slice(0, 2).filter(Boolean), p.slice(2, 4).filter(Boolean)];
}

// Date, time and place, in a line.
//
// `tbc` is for a game that is AGREED and not yet scheduled -- most of them.
// There, saying "Date TBC" is information: the game is on, the details are
// not settled, and refusing to create one without a date would make Upcoming
// describe a club that plans further ahead than it does. On a request that
// nobody has confirmed yet, the same words are noise: of course it has no
// venue, it is not a fixture.
function requestWhenHtml(req, opts){
  const tbc = !!(opts && opts.tbc);
  const bits = [];
  if(req.preferredDate) bits.push(escapeHtml(req.preferredDate));
  else if(tbc) bits.push('Date TBC');
  if(req.preferredTime) bits.push(escapeHtml(req.preferredTime));
  if(req.location) bits.push(escapeHtml(req.location));
  else if(tbc) bits.push('Venue TBC');
  return bits.length ? bits.join(' · ') + ' · ' : '';
}

// The draft survives a re-render of the Admin screen, which is what makes
// "Add to Upcoming" possible at all: adding one changes the record, the screen
// is redrawn from the record, and without this the four names the admin had
// just chosen would be gone along with the confirmation that it worked.
function predDraftName(side, i){
  const v = predictionDraft && predictionDraft.ok && predictionDraft[side] && predictionDraft[side][i];
  return v ? escapeHtml(v) : '';
}

function predictMatchup(teamA, teamB){
  const ratingOf = (n) => {
    const p = PLAYERS.find(x => x.name.toLowerCase() === String(n).toLowerCase());
    return p ? p.rating : null;
  };
  return MatchPrediction.build(teamA, teamB, ratingOf);
}

// The agreed presentation: expected winning side, expected share of games,
// and a plain sentence of why. Deliberately NOT the technical version it
// replaced -- no blend, no expected-score decimal, no reliability. If this
// card ever needs to say more, it says more in both places at once, because
// there is only one of it.
function matchPredictionHtml(pred, opts){
  const o = opts || {};
  const ratingOf = (n) => {
    const p = PLAYERS.find(x => x.name.toLowerCase() === String(n).toLowerCase());
    return p ? Math.round(p.rating) : '?';
  };
  const nameList = (team) => team.map(n => escapeHtml(n)).join(' & ');
  const ratedList = (team) => team.map(n => `${escapeHtml(n)} (${ratingOf(n)})`).join(' & ');
  const gap = Math.round(pred.gap);

  const verdict = pred.confidence === 'level'
    ? 'Too close to call'
    : `<b>${nameList(pred.favoured)}</b> ${pred.confidence === 'shade' ? 'shade it' : 'should win'}`;
  const edgeLine = pred.confidence === 'level'
    ? 'Level on current ratings.'
    : `Favoured by <b>${gap}</b> rating point${gap === 1 ? '' : 's'}.`;
  const shareLine = pred.confidence === 'level'
    ? `Expected to take about <b>${pred.shareA}%</b> of the games each.`
    : `Expected to win about <b>${pred.favouredShare}%</b> of the games, against <b>${pred.againstShare}%</b>.`;

  // Order is the order the reader asks the questions in: who wins, by how much
  // of the game, who is playing, and how strong the call is.
  return `<div class="matchup-vs" style="margin-top:8px;">
    <div style="font-size:13.5px; color:var(--text);">${verdict}</div>
    <div style="margin-top:6px; font-size:12.5px;">${shareLine}</div>
    <div style="margin-top:8px; font-size:12.5px; color:var(--text-dim);">${ratedList(pred.teamA)} vs ${ratedList(pred.teamB)}</div>
    <div style="margin-top:4px; font-size:12.5px; color:var(--text-dim);">${edgeLine}</div>
    <div style="margin-top:8px; font-size:10.5px; color:var(--text-dim);">${escapeHtml(o.foot || 'Based on current Power Ratings · Prediction only · Nothing is recorded.')}</div>
  </div>`;
}

// Turning a prediction into an agreed game. Admin-only by construction: this
// markup only ever appears inside the Admin screen's Predict a matchup panel.
function buildPredictionToUpcomingHtml(pred){
  const names = pred.teamA.concat(pred.teamB);
  // Shown once, by whichever render follows the write, and then gone.
  const message = predictionUpcomingMessage;
  predictionUpcomingMessage = '';
  return `<div class="fg-controls" style="margin-top:8px;">
    <div class="section-sub">Add this matchup to Upcoming — the ${names.length} player${names.length===1?'':'s'} above carry straight over. Anything not settled yet can stay blank and shows as TBC.</div>
    <div class="fg-row"><label class="fg-label">Date</label><input id="predUpDate" type="date" class="fg-select" /></div>
    <div class="fg-row"><label class="fg-label">Time</label><input id="predUpTime" type="time" class="fg-select" /></div>
    <div class="fg-row"><label class="fg-label">Where</label><input id="predUpPlace" class="fg-select" placeholder="Court or venue (optional)" /></div>
    ${courtBookingCheckboxHtml('predUpBooked')}
    <div class="fg-row"><button class="preset-btn" id="predUpAdd" style="width:100%;">+ Add as an agreed game</button></div>
    <div id="predUpMessage" class="section-sub">${escapeHtml(message || '')}</div>
  </div>`;
}

let predictionUpcomingMessage = '';

// The court booking, asked for explicitly wherever an admin records an agreed
// game. Off unless ticked: a date or a venue is not a booking.
function courtBookingCheckboxHtml(id){
  return `<label class="fx-m-booking" style="margin:4px 0 8px;">
    <input type="checkbox" id="${id}">
    <span><b>Court booking made</b><br><span class="fx-m-sub">Marks this game as booked and moves it to Upcoming.</span></span>
  </label>`;
}

function wirePredictionToUpcoming(box){
  const btn = box.querySelector('#predUpAdd');
  if(!btn) return;
  btn.onclick = async ()=>{
    const msg = box.querySelector('#predUpMessage');
    const pred = predictionDraft;
    if(!pred || !pred.ok){ if(msg) msg.textContent = 'Fill in the matchup first.'; return; }
    const who = requireName();
    if(!who) return;

    // Agreed by an admin, exactly as "add an agreed game" works: there is
    // nobody left to confirm it. Called Out unless the court is booked.
    const booked = !!(box.querySelector('#predUpBooked') || {}).checked;
    const req = FixtureFlow.createAgreed({
      players: pred.teamA.concat(pred.teamB),
      // The sides are the whole point of a predicted matchup, so they are
      // recorded rather than re-derived from the order of the flat list.
      teams: [pred.teamA.slice(), pred.teamB.slice()],
      by: who,
      preferredDate: (box.querySelector('#predUpDate') || {}).value || '',
      preferredTime: (box.querySelector('#predUpTime') || {}).value || '',
      location: ((box.querySelector('#predUpPlace') || {}).value || '').trim(),
      courtBookingMade: booked,
    });
    gameRequestsState.push(req);
    const ok = await saveGameRequests(gameRequestsState);
    if(!ok){
      gameRequestsState.pop();
      if(msg) msg.textContent = storageAvailable()
        ? `Save failed (${lastStorageError || 'unknown error'}) — try again.`
        : `Save failed — this page can't reach shared storage.`;
      return;
    }
    // The prediction itself is not stored. It is recomputed from these same
    // players whenever the Upcoming card asks for it, so it can never go stale
    // against a rating that has since moved.
    predictionUpcomingMessage = `Added to ${booked ? 'Upcoming' : 'Called Out'}: ${pred.teamA.join(' & ')} v ${pred.teamB.join(' & ')}.`;
    dataChanged();
  };
}

function wireRequestPlayerLinks(box){
  box.querySelectorAll('.request-player-link').forEach(el=>{
    el.onclick = ()=> openSheet(el.dataset.player);
  });
}

// The outstanding requests, split three ways for the selected player -- views
// over the same records, never copies. Each request appears in one list only.
//   For me       I'm in it and haven't answered.
//   My Requests  I asked for it, and it isn't agreed yet.
//   Others       everything else still outstanding.
// All newest first, by when the request was made.
function requestLists(viewerName){
  const pending = gameRequestsState.filter(r => r.status === 'pending').sort(FixtureFlow.requestOrder);
  const isMe = (n) => !!viewerName && !!n && String(n).toLowerCase() === viewerName.toLowerCase();
  const forMe = [], mine = [], others = [];
  pending.forEach(r => {
    const me = viewerName ? FixtureFlow.participantName(r, viewerName) : null;
    if(me && !(r.confirmations || {})[me] && !(r.cantPlay || {})[me]) forMe.push(r);
    else if(isMe(r.requestedBy)) mine.push(r);
    else others.push(r);
  });
  return { forMe, mine, others };
}

// "today", "yesterday", "3 days ago" -- by calendar day, where the reader is.
function fmtRequestedDay(iso){
  if(!iso) return '';
  const d = new Date(iso), now = new Date();
  const day = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const n = Math.round((day(now) - day(d)) / 86400000);
  return n <= 0 ? 'today' : n === 1 ? 'yesterday' : `${n} days ago`;
}

// A request the selected player made: where it stands, at a glance.
function buildMyRequestCardHtml(req){
  const sum = FixtureFlow.summaryLine(req, requestTeams);
  const cant = FixtureFlow.cantPlayers(req);
  const waiting = req.players.filter(n => !(req.confirmations || {})[n] && !(req.cantPlay || {})[n]);
  const status = [`${FixtureFlow.confirmedCount(req)}/${req.players.length} agreed`];
  if(cant.length) status.unshift(`<span class="fx-tag fx-tag-attn">Needs attention</span> ${escapeHtml(cant.join(', '))} can't play`);
  if(waiting.length) status.push(`Waiting for ${escapeHtml(waiting.join(', '))}`);
  return `<div class="callout-card fx-card fx-mine${cant.length ? ' fx-attn' : ''}" data-fixture-id="${escapeHtml(req.id)}">
    <div class="cc-title">${fixtureTeamsHtml(req)}</div>
    <div class="fx-count">${status.join(' · ')}</div>
    <div class="cc-detail">Requested ${fmtRequestedDay(req.requestedAt)}${req.preferredDate ? ' · proposed ' + escapeHtml(fmtFixtureDate(req.preferredDate)) : ''}${req.batch ? ' · from a list' : ''}</div>
    ${fixtureViewerActionsHtml(req)}
    ${fixtureManageHtml(req)}
  </div>`;
}

// ---- Add multiple games: paste, review, then create ------------------------
// Nothing is written until the reviewed list is confirmed with one tap.
let bulkDraft = { text: '', rows: null, me: null, by: null, choices: {}, skip: {}, editing: {}, message: '' };

const STAGE_PLACE = { proposed: 'Requests', 'called-out': 'Called Out', upcoming: 'Upcoming', attention: 'Needs attention' };

// Every parsed row with the person's choices applied, and what would stop it.
function bulkReviewed(){
  if(!bulkDraft.rows) return [];
  const now = new Date().toISOString();
  const seen = [];
  return bulkDraft.rows.map(row => {
    const r = FixtureParse.review(row, bulkDraft.choices[row.lineNo], { canon: playerIdFor });
    const warnings = [];
    if(r.ready){
      FixtureFlow.matchupDuplicates(r.players, gameRequestsState, { canon: playerIdFor, teams: r.teams, now }).forEach(d => {
        warnings.push(`This matchup already exists in ${STAGE_PLACE[d.stage] || 'the fixtures'}${d.samePartnerships ? ', with the same partnerships' : ''}.`);
      });
      const key = r.players.map(playerIdFor).sort().join('|');
      const earlier = seen.find(x => x.key === key);
      if(earlier) warnings.push(`The same four players are on line ${earlier.lineNo} of this list.`);
      seen.push({ key, lineNo: row.lineNo });
    }
    const include = r.ready && !bulkDraft.skip[row.lineNo];
    return { row, ...r, warnings, include };
  });
}

function bulkSeatSelectHtml(row, si, pi, p, value){
  const names = allPlayerNames();
  const first = (p.options || []).filter(n => names.includes(n));
  const rest = names.filter(n => !first.includes(n));
  const opt = (n) => `<option value="${escapeHtml(n)}"${n === value ? ' selected' : ''}>${escapeHtml(n)}</option>`;
  return `<select class="fg-select fx-bulk-seat${value ? '' : ' fx-bulk-open'}" data-line="${row.lineNo}" data-side="${si}" data-seat="${pi}" aria-label="Line ${row.lineNo}, side ${si ? 'B' : 'A'}, player ${pi + 1}">
    <option value=""${value ? '' : ' selected'}>${escapeHtml(p.text ? `“${p.text}” — choose` : 'Choose')}</option>
    ${first.length ? `<optgroup label="Could be">${first.map(opt).join('')}</optgroup><optgroup label="Everyone">${rest.map(opt).join('')}</optgroup>` : names.map(opt).join('')}
  </select>`;
}

function bulkSectionHtml(){
  const who = submissionIdentity();
  let h = `<div id="reqFoldBulkBody">`;
  if(!bulkDraft.rows){
    h += `<div class="section-sub">Paste or write a list — one game per line, e.g. <i>Me &amp; PDM vs Rishi &amp; Erf</i>. “Me” is you. Nothing is sent until you have checked the list.</div>`;
    h += identityLineHtml('Requesting');
    h += `<textarea id="bulkText" class="fg-select fx-bulk-text" rows="7" placeholder="Me &amp; PDM vs Rishi &amp; Erf&#10;Shaun/PDM v Tom/Osh&#10;Me and KC against Len and Eli">${escapeHtml(bulkDraft.text)}</textarea>
      <div class="fx-actions"><button type="button" class="preset-btn" id="bulkParse">Check games</button></div>`;
    if(bulkDraft.message) h += `<div class="section-sub" style="color:var(--gold-bright);">${escapeHtml(bulkDraft.message)}</div>`;
    return h + `</div>`;
  }
  const rows = bulkReviewed();
  const ready = rows.filter(r => r.ready).length;
  const creating = rows.filter(r => r.include).length;
  const needs = rows.length - ready;
  h += `<div class="fx-bulk-summary"><b>${rows.length} game${rows.length === 1 ? '' : 's'} found</b> · ${ready} ready${needs ? ` · ${needs} need${needs === 1 ? 's' : ''} fixing` : ''}</div>`;
  h += `<div class="section-sub">Requested by ${escapeHtml(bulkDraft.by || who || '—')}${bulkDraft.me ? ` · “Me” is ${escapeHtml(bulkDraft.me)}` : ''}</div>`;
  rows.forEach(r => {
    const row = r.row;
    const fixable = !row.problems.length;
    const icon = r.ready ? (r.warnings.length ? '⚠' : '✓') : (fixable ? '⚠' : '✖');
    const title = r.ready ? `${r.teams[0].map(escapeHtml).join(' &amp; ')} vs ${r.teams[1].map(escapeHtml).join(' &amp; ')}` : escapeHtml(row.text);
    h += `<div class="fx-bulk-row ${r.ready ? 'is-ready' : 'is-blocked'}" data-line="${row.lineNo}">
      <div class="fx-bulk-head"><span class="fx-bulk-icon">${icon}</span><span class="fx-bulk-title">${title}</span>
        ${r.ready ? `<label class="fx-bulk-include"><input type="checkbox" class="fx-bulk-inc" data-line="${row.lineNo}"${r.include ? ' checked' : ''}> Create</label>` : ''}</div>
      <div class="fx-bulk-line">Line ${row.lineNo}: “${escapeHtml(row.text)}”</div>`;
    // A ready game shows its players as read; its seats open only to change
    // one. A game that needs a decision shows them straight away.
    const showSeats = fixable && (!r.ready || bulkDraft.editing[row.lineNo]);
    if(fixable && r.ready){
      h += `<button type="button" class="lg-inline-fold fx-bulk-change" data-line="${row.lineNo}" aria-expanded="${!!bulkDraft.editing[row.lineNo]}">${bulkDraft.editing[row.lineNo] ? 'Done' : 'Change players'}<span class="lg-inline-chev" aria-hidden="true">${bulkDraft.editing[row.lineNo] ? '⌄' : '›'}</span></button>`;
    }
    if(showSeats){
      h += row.sides.map((side, si) => `<div class="fx-bulk-side"><span class="fx-m-label">Side ${si ? 'B' : 'A'}</span>${
        side.map((p, pi) => bulkSeatSelectHtml(row, si, pi, p, r.teams[si][pi])).join('')}</div>`).join('');
    }
    r.issues.forEach(i => { h += `<div class="fx-note fx-note-attn">${escapeHtml(i.message)}</div>`; });
    if(!fixable) h += `<div class="fx-note">Fix this line in the list and check again.</div>`;
    r.warnings.forEach(w => { h += `<div class="fx-note fx-note-warn">⚠ ${escapeHtml(w)}</div>`; });
    h += `</div>`;
  });
  if(bulkDraft.message) h += `<div class="section-sub" style="color:var(--gold-bright);">${escapeHtml(bulkDraft.message)}</div>`;
  h += `<div class="fx-actions">
    <button type="button" class="preset-btn fx-in" id="bulkCreate"${creating ? '' : ' disabled'}>Create ${creating} request${creating === 1 ? '' : 's'}</button>
    <button type="button" class="preset-btn" id="bulkEdit">Edit list</button>
  </div>`;
  return h + `</div>`;
}

function wireBulk(box){
  const text = box.querySelector('#bulkText');
  if(text) text.oninput = ()=>{ bulkDraft.text = text.value; };
  const parseBtn = box.querySelector('#bulkParse');
  if(parseBtn) parseBtn.onclick = ()=>{
    bulkDraft.text = text ? text.value : bulkDraft.text;
    const by = submissionIdentity();
    const viewer = getCurrentViewer();
    if(!by){ bulkDraft.message = 'Choose who you are first — the games are requested in your name.'; renderWishlist(); return; }
    const rows = FixtureParse.parse(bulkDraft.text, { directory: allPlayerNames(), me: viewer ? viewer.name : null });
    if(!rows.length){ bulkDraft.message = 'Nothing to check yet — write one game per line.'; renderWishlist(); return; }
    Object.assign(bulkDraft, { rows, by, me: viewer ? viewer.name : null, choices: {}, skip: {}, editing: {}, message: '' });
    renderWishlist();
  };
  box.querySelectorAll('.fx-bulk-seat').forEach(sel=>{
    sel.onchange = ()=>{
      const line = +sel.dataset.line;
      const c = bulkDraft.choices[line] || (bulkDraft.choices[line] = [[], []]);
      c[+sel.dataset.side][+sel.dataset.seat] = sel.value || null;
      renderWishlist();
    };
  });
  box.querySelectorAll('.fx-bulk-inc').forEach(cb=>{
    cb.onchange = ()=>{ bulkDraft.skip[+cb.dataset.line] = !cb.checked; renderWishlist(); };
  });
  const edit = box.querySelector('#bulkEdit');
  if(edit) edit.onclick = ()=>{ Object.assign(bulkDraft, { rows: null, choices: {}, skip: {}, editing: {}, message: '' }); renderWishlist(); };
  box.querySelectorAll('.fx-bulk-change').forEach(btn=>{
    btn.onclick = ()=>{ const l = +btn.dataset.line; bulkDraft.editing[l] = !bulkDraft.editing[l]; renderWishlist(); };
  });
  const create = box.querySelector('#bulkCreate');
  if(create) create.onclick = async ()=>{
    const by = submissionIdentity();
    if(!by || by !== bulkDraft.by){
      bulkDraft.message = `You're now ${by || 'nobody'} — check the list again so the games are requested in the right name.`;
      bulkDraft.rows = null; renderWishlist(); return;
    }
    const go = bulkReviewed().filter(r => r.include);
    if(!go.length) return;
    const at = new Date().toISOString();
    const batchId = 'batch_' + Date.parse(at) + '_' + Math.random().toString(36).slice(2, 6);
    const made = go.map((r, i) => FixtureFlow.createRequest({
      players: r.players, teams: r.teams, requestedBy: by, at,
      batch: { id: batchId, index: i, size: go.length },
    }));
    const before = gameRequestsState.length;
    gameRequestsState.push(...made);
    const ok = await saveGameRequests(gameRequestsState);
    if(!ok){
      gameRequestsState.length = before;
      bulkDraft.message = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — nothing was created. Try again.` : `Save failed — this page can't reach shared storage.`;
      renderWishlist(); return;
    }
    bulkDraft = { text: '', rows: null, me: null, by: null, choices: {}, skip: {}, editing: {}, message: '' };
    requestSectionOpen.mine = true;
    fixtureFlashMessage = `Created ${made.length} request${made.length === 1 ? '' : 's'} — they're under My Requests, and the other players answer them from For me.`;
    dataChanged();
  };
}

function renderWishlist(flashMessage, adminFlashMessage){
  const box = document.getElementById('wishlistView');
  const viewer = getCurrentViewer();

  const openChallenges = challengesState.filter(c => c.state !== 'confirmed').length;
  let html = foldHeading('reqFoldChallenges', `🎯 Challenges (${openChallenges})`, requestSectionOpen.challenges);
  if(requestSectionOpen.challenges){
    html += `<div id="reqFoldChallengesBody">${renderChallengesSection()}</div>`;
  }
  html += `<div class="mp-divider"></div>`;

  // For me, then My Requests: the two lists a player acts on.
  const lists = requestLists(viewer ? viewer.name : null);
  if(fixtureFlashMessage) html += `<div class="section-sub" style="color:var(--gold-bright);">${escapeHtml(fixtureFlashMessage)}</div>`;
  html += foldHeading('reqFoldForMe', `📨 For me (${lists.forMe.length})`, requestSectionOpen.forMe, { summary: 'waiting on your answer' });
  if(requestSectionOpen.forMe){
    html += `<div id="reqFoldForMeBody">`;
    html += !viewer ? `<div class="section-sub">Choose who you are to see the requests waiting on you.</div>`
      : lists.forMe.length ? lists.forMe.map(buildPendingRequestCardHtml).join('')
      : `<div class="section-sub">Nothing waiting on you.</div>`;
    html += `</div>`;
  }
  html += foldHeading('reqFoldMine', `📤 My Requests (${lists.mine.length})`, requestSectionOpen.mine, { summary: 'waiting on others' });
  if(requestSectionOpen.mine){
    html += `<div id="reqFoldMineBody">`;
    html += !viewer ? `<div class="section-sub">Choose who you are to see the requests you've made.</div>`
      : lists.mine.length ? lists.mine.map(buildMyRequestCardHtml).join('')
      : `<div class="section-sub">No requests of yours are waiting. Once all four are in, a game moves to the Upcoming tab.</div>`;
    html += `</div>`;
  }
  html += `<div class="mp-divider"></div>`;
  html += foldHeading('reqFoldRequest', '🙋 Request a game', requestSectionOpen.request,
    { summary: 'name four players' });
  if(requestSectionOpen.request){
  html += `<div id="reqFoldRequestBody">`;
  html += `<div class="section-sub">Name four players. You're in as soon as you ask; the other three answer from their For me list, and you can follow it under My Requests. Once all four are in it moves to the Upcoming tab as Called Out, until a court is booked.</div>`;
  html += identityLineHtml('Requesting');
  html += `<div class="fg-controls">
    <div class="fg-row"><label class="fg-label">Players</label>
      <input id="reqP1" list="playerNamesList" class="fg-select" placeholder="Player 1" style="margin-bottom:6px;" />
      <input id="reqP2" list="playerNamesList" class="fg-select" placeholder="Player 2" style="margin-bottom:6px;" />
      <input id="reqP3" list="playerNamesList" class="fg-select" placeholder="Player 3" style="margin-bottom:6px;" />
      <input id="reqP4" list="playerNamesList" class="fg-select" placeholder="Player 4" />
    </div>
    <datalist id="playerNamesList">${allPlayerNames().map(n=>`<option value="${n}">`).join('')}</datalist>
    <div class="fg-row"><label class="fg-label">Preferred date (optional)</label><input id="reqDate" type="date" class="fg-select" /></div>
    <div class="fg-row"><button class="tab-btn active" id="reqSubmit" style="width:100%;">Request this game</button></div>
    <div id="reqMessage" class="section-sub">${flashMessage || ''}</div>
  </div>`;
  html += `</div>`;
  }

  html += foldHeading('reqFoldBulk', '📋 Add multiple games', requestSectionOpen.bulk,
    { summary: bulkDraft.rows ? 'list being checked' : 'paste a list' });
  if(requestSectionOpen.bulk) html += bulkSectionHtml();

  if(isUnlocked){
    html += foldHeading('reqFoldAdmin', '⚡ Admin: add an agreed game', requestSectionOpen.adminAdd,
      { summary: 'already agreed' });
    if(requestSectionOpen.adminAdd){
    html += `<div id="reqFoldAdminBody">`;
    html += `<div class="section-sub">For a game already agreed in WhatsApp — skips the confirmation step. It is Called Out until a court is booked.</div>`;
    html += `<div class="fg-controls">
      <div class="fg-row"><label class="fg-label">Players</label>
        <input id="adminReqP1" list="playerNamesList" class="fg-select" placeholder="Player 1" style="margin-bottom:6px;" />
        <input id="adminReqP2" list="playerNamesList" class="fg-select" placeholder="Player 2" style="margin-bottom:6px;" />
        <input id="adminReqP3" list="playerNamesList" class="fg-select" placeholder="Player 3" style="margin-bottom:6px;" />
        <input id="adminReqP4" list="playerNamesList" class="fg-select" placeholder="Player 4" />
      </div>
      <div class="fg-row"><label class="fg-label">Preferred date (optional)</label><input id="adminReqDate" type="date" class="fg-select" /></div>
      <div class="fg-row"><label class="fg-label">Time (optional)</label><input id="adminReqTime" type="time" class="fg-select" /></div>
      <div class="fg-row"><label class="fg-label">Where (optional)</label><input id="adminReqPlace" class="fg-select" placeholder="Court or venue" /></div>
      ${courtBookingCheckboxHtml('adminReqBooked')}
      <div class="fg-row"><button class="preset-btn" id="adminReqSubmit" style="width:100%;">Add agreed game</button></div>
      <div id="adminReqMessage" class="section-sub">${adminFlashMessage || ''}</div>
    </div>`;
    html += `</div>`;
    }
  }

  // Everyone else's outstanding requests, newest first.
  html += `<div class="mp-divider"></div>`;
  html += foldHeading('reqFoldOthers', `⏳ Other requests (${lists.others.length})`, requestSectionOpen.others,
    { summary: 'everyone else' });
  if(requestSectionOpen.others){
    html += `<div id="reqFoldOthersBody">`;
    html += lists.others.length ? lists.others.map(buildPendingRequestCardHtml).join('')
      : `<div class="section-sub">No other open requests.</div>`;
    html += `</div>`;
  }

  box.innerHTML = html;
  wireRequestPlayerLinks(box);
  wireIdentityLines(box);
  wireFixtureControls(box);
  wireChallengeControls(box, flashMessage, adminFlashMessage);
  wireBulk(box);

  [['reqFoldChallenges','challenges'], ['reqFoldForMe','forMe'], ['reqFoldMine','mine'], ['reqFoldRequest','request'],
   ['reqFoldBulk','bulk'], ['reqFoldAdmin','adminAdd'], ['reqFoldOthers','others']].forEach(([id, key])=>{
    const el = document.getElementById(id);
    if(el) el.onclick = ()=>{ requestSectionOpen[key] = !requestSectionOpen[key]; renderWishlist(); };
  });

  // Every control below belongs to a section that may be shut, so none of them
  // can assume its element exists.
  const on = (id, fn) => { const el = document.getElementById(id); if(el) fn(el); };

  on('reqSubmit', (btn)=>{ btn.onclick = async ()=>{
    const msg = document.getElementById('reqMessage');
    const requestedBy = submissionIdentity();
    if(!requestedBy){ msg.textContent = 'Choose who you are first.'; return; }
    const names = ['reqP1','reqP2','reqP3','reqP4'].map(id=>document.getElementById(id).value.trim());
    if(names.some(n=>!n)){ msg.textContent = 'Enter all four players.'; return; }
    if(new Set(names.map(n=>n.toLowerCase())).size !== 4){ msg.textContent = 'The same name appears more than once.'; return; }
    const unrecognized = names.filter(n => !PLAYERS.find(p=>p.name.toLowerCase()===n.toLowerCase()));
    if(unrecognized.length){ msg.textContent = `Unrecognized name${unrecognized.length>1?'s':''}: ${unrecognized.join(', ')}. Add them via Manage first if they're new.`; return; }

    currentUserName = requestedBy;
    await saveMyName(requestedBy);

    // The requester is in by asking, when they are one of the four.
    const req = FixtureFlow.createRequest({
      players: names, requestedBy,
      preferredDate: document.getElementById('reqDate').value || '',
    });
    gameRequestsState.push(req);
    const ok = await saveGameRequests(gameRequestsState);
    if(!ok){
      gameRequestsState.pop();
      msg.textContent = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage.`;
      return;
    }
    requestSectionOpen.mine = true;
    dataChanged({ redraw: ()=> renderWishlist('Requested! It is under My Requests; the other players answer from For me.') });
  }; });

  on('adminReqSubmit', (adminReqSubmit)=>{
    adminReqSubmit.onclick = async ()=>{
      const msg = document.getElementById('adminReqMessage');
      const names = ['adminReqP1','adminReqP2','adminReqP3','adminReqP4'].map(id=>document.getElementById(id).value.trim());
      if(names.some(n=>!n)){ msg.textContent = 'Enter all four players.'; return; }
      if(new Set(names.map(n=>n.toLowerCase())).size !== 4){ msg.textContent = 'The same name appears more than once.'; return; }
      const unrecognized = names.filter(n => !PLAYERS.find(p=>p.name.toLowerCase()===n.toLowerCase()));
      if(unrecognized.length){ msg.textContent = `Unrecognized name${unrecognized.length>1?'s':''}: ${unrecognized.join(', ')}.`; return; }
      const adminName = requireName();
      if(!adminName) return;

      const booked = !!(document.getElementById('adminReqBooked') || {}).checked;
      const req = FixtureFlow.createAgreed({
        players: names, teams: [names.slice(0,2), names.slice(2,4)], by: adminName,
        preferredDate: document.getElementById('adminReqDate').value || '',
        preferredTime: (document.getElementById('adminReqTime') || {}).value || '',
        location: ((document.getElementById('adminReqPlace') || {}).value || '').trim(),
        courtBookingMade: booked,
      });
      gameRequestsState.push(req);
      const ok = await saveGameRequests(gameRequestsState);
      if(!ok){
        gameRequestsState.pop();
        msg.textContent = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage.`;
        return;
      }
      dataChanged({ redraw: ()=> renderWishlist(undefined, booked ? 'Added to Upcoming.' : 'Added to Called Out.') });
    };
  });

}

function renderUpcoming(){
  const box = document.getElementById('upcomingView');
  const S = FixtureFlow.STAGE;
  const now = new Date().toISOString();
  const agreed = gameRequestsState.filter(r => FixtureFlow.isAgreed(r));
  const byStage = (st) => agreed.filter(r => FixtureFlow.stage(r, now) === st);
  // Every list has one explicit order (FixtureFlow): Upcoming answers "what's
  // next?", soonest first; Called Out is a chasing list, newest (or newly
  // restored) first; archived, most recently archived first. Needs attention
  // keeps the newest disruption on top.
  const attention = byStage(S.ATTENTION).sort(FixtureFlow.requestOrder);
  const upcoming = byStage(S.UPCOMING).sort(FixtureFlow.upcomingOrder);
  const calledOut = byStage(S.CALLED_OUT).sort(FixtureFlow.calledOutOrder);
  const archived = byStage(S.ARCHIVED).sort(FixtureFlow.archivedOrder(now));
  // Made before court bookings were recorded: nothing says whether a court is
  // booked, so they sit in Called Out until an admin answers for each one.
  const unrecorded = isUnlocked ? agreed.filter(r => !FixtureFlow.bookingRecorded(r)) : [];

  // Shared by every card: which fixtures already have a result waiting for
  // approval, the recorded results an admin may reconcile against, and today.
  const ctx = {
    now,
    today: localIsoToday(),
    submittedFor: new Set(extraMatchesState.filter(x => x.status === 'pending' && x.fixtureId).map(x => x.fixtureId)),
    results: isUnlocked ? getAllApprovedMatches() : [],
    linked: FixtureFlow.linkedResultIds(gameRequestsState),
  };
  const section = (key, id, label, list, empty, sub) => {
    let h = foldHeading(id, `${label} (${list.length})`, upcomingSectionOpen[key], sub ? { summary: sub } : undefined);
    if(upcomingSectionOpen[key]){
      h += `<div id="${id}Body">`;
      h += list.length ? list.map(r => buildUpcomingCardHtml(r, ctx)).join('') : `<div class="section-sub">${empty}</div>`;
      h += `</div>`;
    }
    return h;
  };

  let html = '';
  if(fixtureFlashMessage) html += `<div class="section-sub" style="color:var(--gold-bright);">${escapeHtml(fixtureFlashMessage)}</div>`;

  if(unrecorded.length){
    html += foldHeading('upFoldReview', `🗂 Court bookings to record (${unrecorded.length})`, upcomingSectionOpen.review, { summary: 'admin' });
    if(upcomingSectionOpen.review){
      html += `<div id="upFoldReviewBody">
        <div class="section-sub">These games were added before Money Padel recorded court bookings, so nothing says whether a court is booked. Until you answer, each is listed under Called Out.</div>
        ${unrecorded.map(r => {
          const sum = FixtureFlow.summaryLine(r, requestTeams);
          const id = escapeHtml(r.id);
          return `<div class="fx-review-row" data-fixture-id="${id}">
            <div class="fx-title">${escapeHtml(sum.title)}</div>
            <div class="fx-meta">${escapeHtml(fixtureWhenText(r))} · added ${fmtRelative(r.requestedAt)}</div>
            <div class="fx-actions">
              <button type="button" class="preset-btn fx-book-set" data-fixture-id="${id}" data-booked="true">Court booked</button>
              <button type="button" class="preset-btn fx-book-set" data-fixture-id="${id}" data-booked="false">Not booked yet</button>
            </div>
          </div>`;
        }).join('')}
      </div>`;
    }
    html += `<div class="mp-divider"></div>`;
  }

  // Needs attention only appears when something needs it -- at the top, so a
  // disrupted game is never lost inside the ordinary lists.
  if(attention.length){
    html += section('attention', 'upFoldAttention', '⚠️ Needs attention', attention, '');
    html += `<div class="mp-divider"></div>`;
  }
  html += section('upcoming', 'upFoldUpcoming', '📅 Upcoming', upcoming,
    'No court-booked games yet. A Called Out game moves here once an admin records its court booking.', 'court booked');
  html += `<div class="mp-divider"></div>`;
  html += section('calledOut', 'upFoldCalledOut', '📣 Called Out', calledOut,
    'Nothing called out. A request lands here once all four players are in.', 'agreed, court not booked');
  // Call-outs nobody organised: 14 days without a booking, or archived by an
  // admin. Kept whole, folded away, restorable.
  html += section('archived', 'upFoldArchived', '🗃 Archived call-outs', archived,
    `Nothing archived. A Called Out game moves here after ${FixtureFlow.ARCHIVE_DAYS} days without a court booking.`, 'not deleted');

  box.innerHTML = html;
  wireRequestPlayerLinks(box);
  wireRequestPredictions(box);
  wireFixtureControls(box);

  [['upFoldReview','review'], ['upFoldAttention','attention'], ['upFoldUpcoming','upcoming'], ['upFoldCalledOut','calledOut'], ['upFoldArchived','archived']].forEach(([id, key])=>{
    const el = document.getElementById(id);
    if(el) el.onclick = ()=>{ upcomingSectionOpen[key] = !upcomingSectionOpen[key]; renderUpcoming(); };
  });

  box.querySelectorAll('.request-addresult-btn').forEach(btn=>{
    btn.onclick = ()=>{
      const req = gameRequestsState.find(r=>r.id===btn.dataset.requestId);
      if(!req) return;
      navigateToGamesTabForResult(req);
    };
  });
}

let summaryMonth = null;

let summaryMode = 'league'; // 'league' | 'information' -- League Table is the default view

function renderSummary(){
  const box = document.getElementById('summaryView');
  // Same "most recently completed month" logic as Power Rankings, so
  // Monthly Summary opens on a finished competition period too, not
  // whatever month happens to have the newest logged match.
  // Also re-checked on every render, not just the first: narrowing the Data
  // Range can strand the month this screen was last left on, and falling back
  // to the default beats rendering an empty month.
  // Normally set on arrival (see the tab handler). Two cases get here
  // without one: a first draw that did not come by navigation, and a month
  // that a narrowed Data Range has taken away -- both re-arrive.
  if(!summaryMonth || (summaryMonth !== 'all' && !getAvailableMonths().includes(summaryMonth))){
    if(summaryMonth && summaryMonthChoice === summaryMonth) summaryMonthChoice = null;
    arriveAtSummary();
  }

  // Month and View stay, both of them -- but side by side rather than stacked,
  // which is 85px of the screen back. On a phone they were pushing the table
  // itself below the fold, and the table is what the screen is for.
  let html = `<div class="fg-controls lg-controls">
    <div class="fg-row"><label class="fg-label">Month</label>
      <select id="summaryMonthSelect" class="fg-select"></select>
    </div>
    <div class="fg-row"><label class="fg-label">View</label>
      <select id="summaryModeSelect" class="fg-select">
        <option value="league">League Table</option>
        <option value="merit">Merit Table</option>
        <option value="race">Monthly Race</option>
        <option value="information">Information</option>
      </select>
    </div>
  </div>
  ${summaryMonthChoice === null ? meaningfulMonthNoteHtml(summaryMonthDefault, summaryMonth, 'summaryMonth') : ''}
  <div id="summaryContent"></div>`;

  box.innerHTML = html;
  populateSummaryMonthSelect();
  wireMeaningfulMonthNote('summaryMonth', (month)=>{
    summaryMonthChoice = month;
    summaryMonth = month;
    renderSummary();
  });
  const modeSel = document.getElementById('summaryModeSelect');
  modeSel.value = summaryMode;
  modeSel.onchange = (e)=>{ summaryMode = e.target.value; renderSummary(); };

  resetLeagueTierSections();

  const legacyExplainer = document.getElementById('explainerWrapper');
  // Merit carries its own explanation too, so the legacy per-tab block would
  // be a second one on that view as well.
  if(legacyExplainer) legacyExplainer.style.display = (summaryMode === 'league' || summaryMode === 'merit' || summaryMode === 'race') ? 'none' : '';

  if(summaryMode === 'league') renderSummaryLeagueTable();
  else if(summaryMode === 'merit') renderMeritTable();
  else if(summaryMode === 'race') renderMonthlyRace();
  else renderSummaryInformation();
}

let leagueGrouped = true;
let leagueSortKey = 'points';
let leagueSortDesc = true;

// The explanation starts closed: the point of the screen is the table, and on
// a phone the explanation was putting it below the fold. Not persisted -- the
// screen should open the same way every time.
let leagueExplainerOpen = false;

// Each tier collapses on its own. A single global `Tier tables` fold was the
// first attempt and was wrong twice over: it added a control heavier than the
// headings it hid, and it made the four tiers one thing when they are four
// separate competitions -- there is no reason hiding Tier C should hide A.
//
// Open by default, and reset to open on entry to By tier: a reader arriving at
// the screen wants the tables, not four collapsed rows to reopen.
let leagueTierOpen = {};
// A tier section with a single player in it is not a table, it is a sentence.
// Shaun, 22 Sep: Tier S should arrive collapsed, "as there's only one player
// there". Expressed as the reason rather than as the letter S, so it stays
// true in both directions -- if Manny is joined by somebody the section opens
// on its own, and if any other tier ever thins to one player it folds without
// anybody having to remember this conversation.
//
// A section the reader has actually touched keeps whatever they set: an
// explicit true or false in the map always wins over the default.
function tierSectionOpenByDefault(rowCount){ return rowCount > 1; }
function tierSectionOpen(state, tier, rowCount){
  return state[tier] === undefined ? tierSectionOpenByDefault(rowCount) : state[tier];
}

// Resetting means forgetting what was touched, not forcing everything open --
// the defaults above then apply again.
function resetLeagueTierSections(){
  leagueTierOpen = {};
}
resetLeagueTierSections();

// Last 10 is a third table alongside By tier / All together, not a mode of
// either: it is not scoped to the selected month at all, so it cannot share
// their month-based aggregation.
//
// Deliberately a SEPARATE flag from `leagueGrouped` rather than one
// three-valued variable. `leagueGrouped` already means "by tier or all
// together" and is written directly by tests and the capture script; a second
// variable that also encoded that fact let a caller set one and leave the
// screen contradicting itself. These two never overlap.
let leagueLastTen = false;

// Every appearance in the record, as LastTen wants them: one entry per player
// per match. Built from the same two sources the monthly aggregation uses --
// ALL_MATCHES/MATCHES for rated results and getAllApprovedMatches() for draws
// -- so the two tables can never disagree about what a game was.
function leagueAppearances(){
  const out = [];
  let seq = 0;
  ALL_MATCHES.forEach((raw, idx)=>{
    const enriched = MATCHES[idx];
    if(!enriched) return;
    const n = ++seq;
    raw.winners.forEach(name => out.push({ name, date: raw.date, result: 'W',
      gamesFor: enriched.games_winner, gamesAgainst: enriched.games_loser, seq: n }));
    raw.losers.forEach(name => out.push({ name, date: raw.date, result: 'L',
      gamesFor: enriched.games_loser, gamesAgainst: enriched.games_winner, seq: n }));
  });
  // Draws sit outside the rating engine, so they are read from the approved
  // matches directly -- but they are still games, and the League Table has
  // always counted them for a point.
  getAllApprovedMatches().filter(m => m.isDraw).forEach(m=>{
    const n = ++seq;
    const t1 = m.sets.reduce((a,[x])=>a+x,0);
    const t2 = m.sets.reduce((a,[,y])=>a+y,0);
    m.winners.forEach(name => out.push({ name, date: m.date, result: 'D', gamesFor: t1, gamesAgainst: t2, seq: n }));
    m.losers.forEach(name => out.push({ name, date: m.date, result: 'D', gamesFor: t2, gamesAgainst: t1, seq: n }));
  });
  return out;
}

// ===================== TABLE DETAIL: THE GAMES BEHIND A COUNT =====================
// One component for every count a League or Merit row lets you open -- P, W,
// D, L, Hard and Fav. The cell is a button that opens a detail row straight
// under the player's row; the detail lists the games the ROW ITSELF recorded
// when it counted them (League: `matchList`, Merit: `games` / `hard` /
// `favoured`), never a fresh query. So a cell reading 2 opens exactly those 2
// games -- same month, same tier section, same split-month treatment -- and
// nothing is re-derived that could disagree with it.
const TABLE_COUNT_KINDS = {
  played: { label: 'Played', of: (list) => list },
  wins:   { label: 'Wins',   of: (list) => list.filter(g => g.result === 'W') },
  draws:  { label: 'Draws',  of: (list) => list.filter(g => g.result === 'D') },
  losses: { label: 'Losses', of: (list) => list.filter(g => g.result === 'L') },
};
function tableDrillKey(player, tier, kind){ return `${player}\u0000${tier || ''}\u0000${kind}`; }

// A count that opens its games. Nothing to explain means nothing to tap: a
// zero stays plain text (or the table's own dash), never an empty drawer.
function tableCountCell(openKey, player, tier, kind, n, opts){
  const o = opts || {};
  if(!n) return o.zero !== undefined ? o.zero : `${n}`;
  const key = tableDrillKey(player, tier, kind);
  const open = openKey === key;
  const label = TABLE_COUNT_KINDS[kind] ? TABLE_COUNT_KINDS[kind].label : kind;
  return `<button type="button" class="merit-count${o.plain ? ' tbl-count' : ''}${open ? ' is-open' : ''}"
    data-player="${escapeHtml(player)}" data-tier="${escapeHtml(tier || '')}" data-kind="${kind}"
    ${o.colour ? `style="color:${o.colour};"` : ''} aria-expanded="${open}" aria-label="${escapeHtml(`${player}: ${n} ${label.toLowerCase()} — show the games`)}">${n}</button>`;
}

// Where the detail applies, said in the heading: which month and which table.
function tableDrillContext(tier){
  const month = summaryMonth === 'all' ? 'All Time' : monthLabel(summaryMonth);
  return `${month} · ${tier ? `Tier ${tier}` : 'All together'}`;
}

// One game from the row's own side of it.
function tableGameLineHtml(g, subject){
  const mine = (g.winners || []).includes(subject) ? 'winners' : 'losers';
  const team = (names) => names.map(escapeHtml).join(' &amp; ');
  const side = (names, which) => which === mine ? `<b>${team(names)}</b>` : team(names);
  const score = (g.sets && g.sets.length) ? g.sets.map(([a,b])=>`${a}-${b}`).join(' ') : '';
  const word = g.result === 'W' ? 'Won' : g.result === 'L' ? 'Lost' : 'Drew';
  const line = g.isDraw
    ? `${side(g.winners, 'winners')} drew with ${side(g.losers, 'losers')}`
    : `${side(g.winners, 'winners')} beat ${side(g.losers, 'losers')}`;
  return `<div class="merit-drill-row">
    <div class="merit-drill-top">
      <span class="merit-drill-date">${escapeHtml(g.date)}</span>
      <span class="merit-drill-pts tbl-result tbl-result-${g.result}">${word}</span>
    </div>
    <div class="merit-drill-teams">${line}</div>
    ${score ? `<div class="merit-drill-meta">${escapeHtml(score)}</div>` : ''}
  </div>`;
}

// The detail row itself, newest game first (same-day games in the order they
// were recorded, unless a caller keeps an order of its own).
const NEWEST_FIRST = (a,b)=> a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
function tableDrillRowHtml(cols, head, games, lineFn, order){
  return `<tr class="merit-drill"><td colspan="${cols}" style="padding:0;">
    <div class="merit-drill-body">
      <div class="merit-drill-head">${head}</div>
      ${games.slice().sort(order || NEWEST_FIRST).map(lineFn).join('')}
    </div>
  </td></tr>`;
}

// The P/W/D/L detail for one row, if it is the one open.
function tableCountDrillHtml(openKey, cols, player, tier, list){
  const kind = Object.keys(TABLE_COUNT_KINDS).find(k => openKey === tableDrillKey(player, tier, k));
  if(!kind) return '';
  const games = TABLE_COUNT_KINDS[kind].of(list || []);
  const head = `${escapeHtml(player)} · ${TABLE_COUNT_KINDS[kind].label} · ${escapeHtml(tableDrillContext(tier))} · ${games.length} game${games.length === 1 ? '' : 's'}`;
  return tableDrillRowHtml(cols, head, games, (g) => tableGameLineHtml(g, player));
}

// Taps on any count in a table: the same tap again closes it.
function wireTableCounts(content, getOpen, setOpen, redraw){
  content.querySelectorAll('.merit-count').forEach(btn=>{
    btn.onclick = ()=>{
      const key = tableDrillKey(btn.dataset.player, btn.dataset.tier, btn.dataset.kind);
      setOpen(getOpen() === key ? null : key);
      redraw();
    };
  });
}

// Order matters here: the league-calculation fields (P/W/L/D/GD/Pts) come
// first so they're what's visible in an iPhone-width viewport without
// scrolling; Avg Opp/Form are supporting context, not part of the points
// calculation, and deliberately sit last so they're what overflows (behind
// a subtle divider -- see .league-context-col in app.css) if anything has
// to.
const LEAGUE_COLUMNS = [
  { key: null, label: '#', align: 'left' },
  { key: 'name', label: 'Player', align: 'left' },
  { key: 'games', label: 'P', align: 'center' },
  { key: 'wins', label: 'W', align: 'center' },
  { key: 'losses', label: 'L', align: 'center' },
  { key: 'draws', label: 'D', align: 'center' },
  { key: 'gd', label: 'GD', align: 'center' },
  { key: 'points', label: 'Pts', align: 'right' },
  { key: 'avg_opp', label: 'Avg Opp', align: 'center' },
  { key: 'recent_form', label: 'Form (10g)', align: 'center' },
];

function sortLeagueRows(rows){
  const key = leagueSortKey;
  const dir = leagueSortDesc ? -1 : 1;
  return rows.slice().sort((a,b)=>{
    let av = a[key], bv = b[key];
    if(key === 'name') return dir * a.name.localeCompare(b.name);
    if(av === undefined || av === null) av = -Infinity;
    if(bv === undefined || bv === null) bv = -Infinity;
    if(av !== bv) return dir * (av - bv);
    // Stable tiebreak so ties don't jump around between renders.
    return b.points - a.points || b.gd - a.gd || a.name.localeCompare(b.name);
  });
}

// Which League count is open, if any. One at a time, as in Merit.
let leagueDrill = null;

function buildLeagueTableHtml(rows, showTierColumn){
  const sorted = sortLeagueRows(rows);
  const cols = showTierColumn ? 11 : 10;
  let html = `<div class="callout-card" style="padding:0; overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:11px; white-space:nowrap;">
      <thead><tr style="background:var(--bg2); text-align:left;">`;
  html += `<th style="padding:7px 4px 7px 8px;">#</th>`;
  html += `<th class="league-sort-th" data-key="name" style="padding:7px 4px; cursor:pointer;">Player${leagueSortKey==='name'?(leagueSortDesc?' ▾':' ▴'):''}</th>`;
  if(showTierColumn) html += `<th style="padding:7px 4px; text-align:center;">Tier</th>`;
  // Core league-calculation columns first (what an iPhone-width viewport
  // needs to show without scrolling); avg_opp/recent_form are supporting
  // context, not part of the points calculation, so they come last, and
  // avg_opp gets the separator marking where "the table" ends and
  // "context" begins -- see .league-context-col in app.css.
  ['games','wins','losses','draws','gd','points','avg_opp','recent_form'].forEach(key=>{
    const col = LEAGUE_COLUMNS.find(c=>c.key===key);
    const arrow = leagueSortKey===key ? (leagueSortDesc?' ▾':' ▴') : '';
    const contextClass = key==='avg_opp' ? ' league-context-col' : '';
    html += `<th class="league-sort-th${contextClass}" data-key="${key}" style="padding:7px 4px; text-align:${col.align}; cursor:pointer;">${col.label}${arrow}</th>`;
  });
  html += `</tr></thead><tbody>`;
  sorted.forEach((r,i)=>{
    const formHtml = (r.recent_form !== null && r.recent_form !== undefined)
      ? (r.recent_form_stale
          ? `<span style="color:var(--text-dim); opacity:0.7;" title="stale">${r.recent_form>=0?'+':''}${r.recent_form}% (${r.recent_form_wins}W-${r.recent_form_losses}L) ⏸</span>`
          : `<span style="color:${r.recent_form>3?'var(--green)':(r.recent_form<-3?'var(--red)':'var(--text-dim)')};">${r.recent_form>=0?'+':''}${r.recent_form}%</span> <span style="color:var(--text-dim); font-size:10px;">(${r.recent_form_wins}W-${r.recent_form_losses}L)</span>`)
      : `<span style="color:var(--text-dim);">–</span>`;
    html += `<tr style="border-top:1px solid var(--line);">
      <td style="padding:7px 4px 7px 8px; color:var(--text-dim);">${i+1}</td>
      <td style="padding:7px 4px;"><span class="request-player-link" data-player="${r.name}" style="text-decoration:underline; cursor:pointer; font-weight:700;">${r.name}</span></td>
      ${showTierColumn ? `<td style="padding:7px 4px; text-align:center;"><span class="badge ${r.tier}" style="display:inline-flex; width:20px; height:20px; font-size:10px;">${r.tier}</span></td>` : ''}
      <td style="padding:7px 4px; text-align:center;">${tableCountCell(leagueDrill, r.name, r.segmentTier, 'played', r.games, { plain: true })}</td>
      <td style="padding:7px 4px; text-align:center; color:var(--green);">${tableCountCell(leagueDrill, r.name, r.segmentTier, 'wins', r.wins, { plain: true, colour: 'var(--green)' })}</td>
      <td style="padding:7px 4px; text-align:center; color:var(--red);">${tableCountCell(leagueDrill, r.name, r.segmentTier, 'losses', r.losses, { plain: true, colour: 'var(--red)' })}</td>
      <td style="padding:7px 4px; text-align:center; color:var(--text-dim);">${tableCountCell(leagueDrill, r.name, r.segmentTier, 'draws', r.draws, { plain: true, colour: 'var(--text-dim)' })}</td>
      <td style="padding:7px 4px; text-align:center;">${r.gd>=0?'+':''}${r.gd}</td>
      <td style="padding:7px 8px 7px 4px; text-align:right; font-weight:700; color:var(--gold-bright);">${r.points}</td>
      <td class="league-context-col" style="padding:7px 4px; text-align:center;">${r.avg_opp}</td>
      <td style="padding:7px 4px; text-align:center;">${formHtml}</td>
    </tr>`;
    html += tableCountDrillHtml(leagueDrill, cols, r.name, r.segmentTier, r.matchList);
  });
  html += `</tbody></table></div>`;
  return html;
}

// The Last 10 table. Deliberately a different table from the monthly one:
// no Tier column (a form table is club-wide by nature), no Avg Opp, and a
// Last 10 column in place of Form (10g) -- showing that percentage beside a
// table built from the same ten games would be the same fact told twice.
const LAST10_SORT_FALLBACK = (a,b)=> b.points - a.points || b.gd - a.gd || b.games - a.games || a.name.localeCompare(b.name);

function sortLastTenRows(rows){
  const key = leagueSortKey;
  const dir = leagueSortDesc ? -1 : 1;
  return rows.slice().sort((a,b)=>{
    if(key === 'name') return dir * a.name.localeCompare(b.name);
    let av = a[key], bv = b[key];
    // This table has no avg_opp or recent_form column, so a sort key carried
    // over from the monthly table would compare undefined against undefined
    // and leave the rows in hash order. Fall back to the league's own order.
    if(av === undefined || bv === undefined) return LAST10_SORT_FALLBACK(a,b);
    if(av === null) av = -Infinity;
    if(bv === null) bv = -Infinity;
    if(av !== bv) return dir * (av - bv);
    return LAST10_SORT_FALLBACK(a,b);
  });
}

// The run, newest first. Points say how the ten went; this says which way
// they are going, which is the whole reason to look at form rather than a
// season table.
// The third renderer of a form run, and the reason the classification is
// shared rather than repeated: this one keyed a colour map off the raw letter,
// Home tested it for truth, and the profile lower-cased it. Three answers to
// one question is how they came to disagree.
function lastTenRunHtml(run){
  const colour = { w: 'var(--green)', l: 'var(--red)', d: 'var(--text-dim)', '': 'var(--text-dim)' };
  return run.slice(0, 5).map(r =>
    `<span style="display:inline-block; width:13px; text-align:center; color:${colour[MatchOutcome.classFor(r)]}; font-weight:700;">${r}</span>`
  ).join('');
}

function buildLastTenTableHtml(rows){
  const sorted = sortLastTenRows(rows);
  const cols = [
    { key: 'games', label: 'P' }, { key: 'wins', label: 'W' },
    { key: 'losses', label: 'L' }, { key: 'draws', label: 'D' },
    { key: 'gd', label: 'GD' }, { key: 'points', label: 'Pts' },
  ];
  let html = `<div class="callout-card" style="padding:0; overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; font-size:11px; white-space:nowrap;">
      <thead><tr style="background:var(--bg2); text-align:left;">
      <th style="padding:7px 4px 7px 8px;">#</th>
      <th class="league-sort-th" data-key="name" style="padding:7px 4px; cursor:pointer;">Player${leagueSortKey==='name'?(leagueSortDesc?' ▾':' ▴'):''}</th>`;
  cols.forEach(c=>{
    const arrow = leagueSortKey===c.key ? (leagueSortDesc?' ▾':' ▴') : '';
    const align = c.key==='points' ? 'right' : 'center';
    html += `<th class="league-sort-th" data-key="${c.key}" style="padding:7px 4px; text-align:${align}; cursor:pointer;">${c.label}${arrow}</th>`;
  });
  html += `<th class="league-context-col" style="padding:7px 8px 7px 4px; text-align:center;">Last 5</th>`;
  html += `</tr></thead><tbody>`;
  sorted.forEach((r,i)=>{
    // A short sample is marked ON the row, beside the P it applies to. A
    // 4-game row can top this table on points and that is not wrong -- but
    // the reader is told it is four games, not left to infer it.
    const shortMark = r.short
      ? ` <span class="l10-short" title="Fewer than ${r.window} rated games in the record">of ${r.window}</span>`
      : '';
    html += `<tr style="border-top:1px solid var(--line);">
      <td style="padding:7px 4px 7px 8px; color:var(--text-dim);">${i+1}</td>
      <td style="padding:7px 4px;"><span class="request-player-link" data-player="${escapeHtml(r.name)}" style="text-decoration:underline; cursor:pointer; font-weight:700;">${escapeHtml(r.name)}</span></td>
      <td style="padding:7px 4px; text-align:center;">${r.games}${shortMark}</td>
      <td style="padding:7px 4px; text-align:center; color:var(--green);">${r.wins}</td>
      <td style="padding:7px 4px; text-align:center; color:var(--red);">${r.losses}</td>
      <td style="padding:7px 4px; text-align:center; color:var(--text-dim);">${r.draws}</td>
      <td style="padding:7px 4px; text-align:center;">${r.gd>=0?'+':''}${r.gd}</td>
      <td style="padding:7px 4px; text-align:right; font-weight:700; color:var(--gold-bright);">${r.points}</td>
      <td class="league-context-col" style="padding:7px 8px 7px 4px; text-align:center;">${lastTenRunHtml(r.run)}</td>
    </tr>`;
  });
  html += `</tbody></table></div>`;
  return html;
}

// A quiet inline disclosure: text and a small chevron, no card, no border, no
// background. It is a line of text you can tap, not a control competing with
// the table underneath it.
function leagueInlineFold(id, label, open, body){
  return `<button type="button" class="lg-inline-fold" id="${id}" aria-expanded="${open}" aria-controls="${id}Body">
      ${label}<span class="lg-inline-chev" aria-hidden="true">${open ? '⌄' : '›'}</span>
    </button>` + (open ? `<div class="lg-inline-body" id="${id}Body">${body}</div>` : '');
}

// A heading that happens to be tappable. Deliberately still a
// `.section-heading` -- same type, same weight, same spacing as every other
// heading on the screen; the chevron is the only thing added.
//
// `summary` is what the section says about itself while it is shut. A fold
// that hides its own state is worse than no fold: the Games filters could be
// set to one player in August and the screen would simply show fewer games
// with nothing to say why. Closed and silent is only safe when the heading
// already names everything inside it.
function foldHeading(id, label, open, opts){
  const o = opts || {};
  const tail = (!open && o.summary) ? ` <span class="fold-summary">${o.summary}</span>` : '';
  const data = o.data ? Object.entries(o.data).map(([k,v])=>` data-${k}="${escapeHtml(v)}"`).join('') : '';
  return `<button type="button" class="section-heading lg-tier-head" id="${id}"${data}
      aria-expanded="${open}" aria-controls="${o.bodyId || (id + 'Body')}">
      ${label}${tail}<span class="lg-inline-chev" aria-hidden="true">${open ? '⌄' : '›'}</span>
    </button>`;
}

function leagueTierHeading(tier, open){
  return foldHeading(`leagueTier${escapeHtml(tier)}`, `Tier ${escapeHtml(tier)}`, open,
    { data: { tier }, bodyId: `leagueTierBody${escapeHtml(tier)}` });
}

// The tiers a player occupied across a month, as `B` or `B → A`. Built from
// the recorded tier changes rather than from the dates they happened to play,
// because occupying a tier and playing in one are different things.
//
// All Time is not a month and a whole career of moves is not a table column,
// so it falls back to where they are now.
function tierSpellLabel(name, month){
  if(!month || month === 'all' || !V3_TIER_HISTORY) return null;
  const start = month + '-01';
  const end = month + '-31';
  const dates = [start].concat(
    (V3_TIER_HISTORY.changesFor(name) || [])
      .map(c => c.effectiveDate)
      .filter(d => d >= start && d <= end));
  return LeagueSplit.transitionLabel(LeagueSplit.tiersOver(dates, (d) => historicalTierOf(name, d)));
}

function renderSummaryLeagueTable(){
  const content = document.getElementById('summaryContent');
  const label = summaryMonth === 'all' ? 'All Time' : monthLabel(summaryMonth);

  // Two different questions, so two aggregations.
  //
  //   By tier      — each match filed under the tier in force on its own date,
  //                  so a player who moved mid-month appears in both tables
  //                  with only what they earned while in each.
  //   All together — not a tier table, so one row for the whole month, with
  //                  the tier column saying what changed.
  //
  // Recent Form is always the last-10-games figure (not scoped to the selected
  // month) -- the same established meaning it has everywhere else in the app.
  const withForm = (s, tier) => {
    const form = computeRecentForm(s.name, 10);
    return {
      ...s, tier,
      recent_form: form ? form.avgPct : null,
      recent_form_wins: form ? form.wins : 0,
      recent_form_losses: form ? form.losses : 0,
      recent_form_stale: form ? form.daysSinceLastGame > RECENT_FORM_STALE_DAYS : false,
    };
  };

  const splitRows = Object.values(computeMonthlySummaryStats(summaryMonth, { splitByTier: true }))
    .map(s => withForm(s, s.segmentTier || '?'));

  const wholeRows = Object.values(computeMonthlySummaryStats(summaryMonth)).map(s => {
    // The tier column shows the month as it was LIVED, not as it was played:
    // a player promoted on the 20th occupied two tiers in September whether or
    // not they got on court again, and the row should say so.
    const p = PLAYERS.find(x=>x.name===s.name);
    const label = tierSpellLabel(s.name, summaryMonth);
    return withForm(s, label || (p ? p.tier : '?'));
  });

  const isLastTen = leagueLastTen;

  // Last 10 is club-wide and spans whatever months each player's own games
  // fall in, so the month in the heading would be a lie on that view.
  let html = `<div class="section-heading" style="margin-top:6px;">🏆 ${isLastTen ? 'Last 10' : label + ' League Table'}</div>`;

  html += leagueInlineFold('leagueExplainerToggle', 'How this table works', leagueExplainerOpen,
    isLastTen
      ? `<div class="section-sub" style="margin:0;">Each player's own most recent ${LastTen.WINDOW} rated games, wherever they fall — this table is not scoped to the selected month, so two rows cover the same number of games rather than the same number of days. Same league scoring as everywhere else: 3 points for a win, 1 for a draw, tiebreak on game difference. Anyone with fewer than ${LastTen.WINDOW} games in the record shows the games they actually have, marked <span class="l10-short">of ${LastTen.WINDOW}</span> — the sample is never padded. "Last 5" is the run, newest first. Tap a column header to sort by it.</div>`
      : `<div class="section-sub" style="margin:0;">Updates live as the month's games are added — 3 points for a win, 1 for a draw, tiebreak on game difference. Tap a column header to sort by it. "Form" is each player's last 10 games overall, not scoped to this month. Tier S isn't shown — one player can't have a table.${leagueGrouped ? ' A player who changed tier mid-month appears in both tier tables, holding only the points they earned in each.' : ''}</div>`);

  html += `<div class="fg-toggle" style="margin:8px 0 14px;">
    <button class="fg-toggle-btn ${!isLastTen && leagueGrouped?'active':''}" id="leagueGroupedBtn">By tier</button>
    <button class="fg-toggle-btn ${!isLastTen && !leagueGrouped?'active':''}" id="leagueAllBtn">All together</button>
    <button class="fg-toggle-btn ${isLastTen?'active':''}" id="leagueLastTenBtn">Last 10</button>
  </div>`;

  if(isLastTen){
    const rows = PerfTrace.time('LastTen.build', ()=> LastTen.build(leagueAppearances())).filter(r => r.games > 0);
    if(rows.length === 0) html += `<div class="section-sub">No rated games in the record yet.</div>`;
    else html += buildLastTenTableHtml(rows);
  } else if(leagueGrouped){
    // Every tier the club actually uses, so a Tier S player is not silently
    // dropped from the grouped table. Each one collapses on its own: they are
    // four separate competitions, not one block.
    let anyTierShown = false;
    TIER_ORDER_LIST.forEach(tier=>{
      const rows = splitRows.filter(s => s.tier === tier && s.games > 0);
      if(rows.length === 0) return;
      anyTierShown = true;
      const open = tierSectionOpen(leagueTierOpen, tier, rows.length);
      html += leagueTierHeading(tier, open);
      if(open) html += `<div id="leagueTierBody${tier}">${buildLeagueTableHtml(rows, false)}</div>`;
    });
    if(!anyTierShown) html += `<div class="section-sub">No games recorded for ${label}.</div>`;
  } else {
    const rows = wholeRows.filter(s => s.tier !== 'S' && s.games > 0);
    if(rows.length === 0) html += `<div class="section-sub">No games recorded for ${label}.</div>`;
    else html += buildLeagueTableHtml(rows, true);
  }

  content.innerHTML = html;
  wireRequestPlayerLinks(content);
  wireTableCounts(content, ()=> leagueDrill, (k)=>{ leagueDrill = k; }, renderSummaryLeagueTable);

  const setView = (lastTen, grouped)=>{
    // The two tables do not have the same columns, so a sort key picked on one
    // must not survive onto the other -- it would leave the arriving table
    // sorted by a column it does not contain, which is to say not sorted.
    if(lastTen !== isLastTen) { leagueSortKey = 'points'; leagueSortDesc = true; }
    const enteringByTier = !lastTen && grouped === true && (isLastTen || !leagueGrouped);
    leagueLastTen = lastTen;
    if(grouped !== undefined) leagueGrouped = grouped;
    // Arriving at By tier shows the tables. Whatever was collapsed on a
    // previous visit is not a preference worth restoring someone into.
    if(enteringByTier) resetLeagueTierSections();
    leagueDrill = null;
    renderSummaryLeagueTable();
  };
  document.getElementById('leagueGroupedBtn').onclick = ()=> setView(false, true);
  document.getElementById('leagueAllBtn').onclick = ()=> setView(false, false);
  // Last 10 leaves the By tier / All together choice alone, so returning from
  // it lands on whichever the reader was on.
  document.getElementById('leagueLastTenBtn').onclick = ()=> setView(true);

  const explainerBtn = document.getElementById('leagueExplainerToggle');
  if(explainerBtn) explainerBtn.onclick = ()=>{ leagueExplainerOpen = !leagueExplainerOpen; renderSummaryLeagueTable(); };
  // One tier's chevron touches that tier and nothing else.
  content.querySelectorAll('.lg-tier-head').forEach(btn=>{
    btn.onclick = ()=>{
      const t = btn.dataset.tier;
      const rowsHere = splitRows.filter(x => x.tier === t && x.games > 0).length;
      leagueTierOpen[t] = !tierSectionOpen(leagueTierOpen, t, rowsHere);
      renderSummaryLeagueTable();
    };
  });

  content.querySelectorAll('.league-sort-th').forEach(th=>{
    th.onclick = ()=>{
      const key = th.dataset.key;
      if(leagueSortKey === key) leagueSortDesc = !leagueSortDesc;
      else { leagueSortKey = key; leagueSortDesc = true; }
      renderSummaryLeagueTable();
    };
  });
}

// ===================== MERIT TABLE =====================
// An alternative league view, not a replacement and not a rating. The League
// Table treats every win alike; this one asks how hard the partnership you beat
// was, using ONLY the tiers held on the day of the match.
//
// It lives behind the existing View select rather than as a fourth segmented
// button: that control already answers "which table am I looking at", and a
// fourth button on a 375px screen is the overcrowding the brief warned about.
// Everything below it -- month, By tier / All together, the independent tier
// collapses -- is the League screen's own machinery, reused.

let meritTierOpen = {};
function resetMeritTierSections(){
  meritTierOpen = {};
}
resetMeritTierSections();
let meritExplainerOpen = false;
// One drill-down open at a time: two expanded lists on a phone is a wall.
let meritDrill = null;

// Every approved match in a shape MeritTable understands. One source, so Merit
// and the League can never disagree about what a game was.
function meritMatches(month){
  return getAllApprovedMatches()
    .filter(m => month === 'all' || m.date.slice(0,7) === month)
    .map(m => ({ id: m.id, date: m.date, winners: m.winners, losers: m.losers,
      isDraw: !!m.isDraw, sets: m.sets, type: m.type }));
}

// The two halves of the same story: Hard is a win over a stronger pairing,
// Favoured a win over a weaker one. An even-strength win counts toward
// neither -- it is the baseline both are measured from.
//
// Column labels are deliberately terse. A ninth column on a 375px screen is
// the difference between a table and a horizontal scroll, and the drill-down
// underneath says in full what the header cannot.
function meritDrillKey(row, kind){ return tableDrillKey(row.playerId, row.tier, kind); }

function meritCountCell(row, kind){
  const n = kind === 'hard' ? row.hardWins : row.easyWins;
  return tableCountCell(meritDrill, row.playerId, row.tier, kind, n,
    { zero: `<span style="color:var(--text-dim);">–</span>`, colour: kind === 'hard' ? 'var(--green)' : 'var(--text-dim)' });
}

// One qualifying match, said plainly enough that a reader can check the
// classification themselves: who played, at what tiers, how far apart those
// pairings were, and what the win was therefore worth.
function meritDrillRowHtml(d, subject){
  const side = (names, tiers) => names.map((n,i)=>
    `${escapeHtml(n)}<span class="merit-drill-tier">${escapeHtml(tiers[i] || '?')}</span>`).join(' & ');
  const score = (d.sets && d.sets.length)
    ? d.sets.map(([a,b])=>`${a}-${b}`).join(' ')
    : '';
  const gap = d.steps === 0 ? 'even' : `${d.steps} tier-step${d.steps===1?'':'s'}`;
  return `<div class="merit-drill-row">
    <div class="merit-drill-top">
      <span class="merit-drill-date">${escapeHtml(d.date)}</span>
      <span class="merit-drill-pts">${d.points} pt${d.points===1?'':'s'}</span>
    </div>
    <div class="merit-drill-teams"><b>${side(d.winners, d.winnerTiers)}</b> beat ${side(d.losers, d.loserTiers)}</div>
    <div class="merit-drill-meta">${score ? escapeHtml(score) + ' · ' : ''}${gap} apart${d.kind === 'hard' ? ' · stronger pairing' : ' · weaker pairing'}</div>
  </div>`;
}

function buildMeritTableHtml(rows, showTierColumn){
  let html = `<div class="callout-card" style="padding:0;">
    <table class="merit-table" style="width:100%; border-collapse:collapse; font-size:11px;">
      <thead><tr style="background:var(--bg2); text-align:left;">
      <th style="padding:7px 2px 7px 7px;">#</th>
      <th style="padding:7px 2px;">Player</th>
      ${showTierColumn ? `<th style="padding:7px 2px; text-align:center;">Tier</th>` : ''}
      <th style="padding:7px 2px; text-align:center;">P</th>
      <th style="padding:7px 2px; text-align:center;">W</th>
      <th style="padding:7px 2px; text-align:center;">D</th>
      <th style="padding:7px 2px; text-align:center;">L</th>
      <th style="padding:7px 3px; text-align:right; color:var(--gold-bright);">Pts</th>
      <th style="padding:7px 2px; text-align:center;" title="Wins against a stronger pairing">Hard</th>
      <th style="padding:7px 7px 7px 2px; text-align:center;" title="Wins against a weaker pairing">Fav</th>
      </tr></thead><tbody>`;
  const cols = showTierColumn ? 10 : 9;
  rows.forEach((r,i)=>{
    html += `<tr style="border-top:1px solid var(--line);">
      <td style="padding:7px 2px 7px 7px; color:var(--text-dim);">${i+1}</td>
      <td style="padding:7px 2px;"><span class="request-player-link" data-player="${escapeHtml(r.playerId)}" style="text-decoration:underline; cursor:pointer; font-weight:700;">${escapeHtml(r.playerId)}</span></td>
      ${showTierColumn ? `<td style="padding:7px 2px; text-align:center;"><span class="badge ${r.tier}" style="display:inline-flex; width:20px; height:20px; font-size:10px;">${r.tier}</span></td>` : ''}
      <td style="padding:7px 2px; text-align:center;">${tableCountCell(meritDrill, r.playerId, r.tier, 'played', r.played, { plain: true })}</td>
      <td style="padding:7px 2px; text-align:center; color:var(--green);">${tableCountCell(meritDrill, r.playerId, r.tier, 'wins', r.wins, { plain: true, colour: 'var(--green)' })}</td>
      <td style="padding:7px 2px; text-align:center; color:var(--text-dim);">${tableCountCell(meritDrill, r.playerId, r.tier, 'draws', r.draws, { plain: true, colour: 'var(--text-dim)' })}</td>
      <td style="padding:7px 2px; text-align:center; color:var(--red);">${tableCountCell(meritDrill, r.playerId, r.tier, 'losses', r.losses, { plain: true, colour: 'var(--red)' })}</td>
      <td style="padding:7px 3px; text-align:right; font-weight:700; color:var(--gold-bright);">${r.merit}</td>
      <td style="padding:7px 2px; text-align:center;">${meritCountCell(r, 'hard')}</td>
      <td style="padding:7px 7px 7px 2px; text-align:center;">${meritCountCell(r, 'favoured')}</td>
    </tr>`;
    // Hard and Fav keep their own wording and lines; P/W/D/L use the plain
    // game line. All of them are the same detail row.
    ['hard','favoured'].forEach(kind=>{
      if(meritDrill !== meritDrillKey(r, kind)) return;
      const list = kind === 'hard' ? r.hard : r.favoured;
      html += tableDrillRowHtml(cols,
        `${escapeHtml(r.playerId)} · ${list.length} win${list.length===1?'':'s'} against a ${kind === 'hard' ? 'stronger' : 'weaker'} pairing`,
        list, (d)=> meritDrillRowHtml(d, r.playerId),
        // Hard / Fav keep the order they have always listed in.
        (a,b)=> a.date < b.date ? 1 : -1);
    });
    html += tableCountDrillHtml(meritDrill, cols, r.playerId, r.tier, r.games);
  });
  html += `</tbody></table></div>`;
  return html;
}

function renderMeritTable(){
  const content = document.getElementById('summaryContent');
  const label = summaryMonth === 'all' ? 'All Time' : monthLabel(summaryMonth);
  const matches = meritMatches(summaryMonth);

  let html = `<div class="section-heading" style="margin-top:6px;">🥇 ${label} Merit Table</div>`;
  html += `<div class="section-sub" style="margin:2px 0 0;">Harder wins earn more.</div>`;
  html += leagueInlineFold('meritExplainerToggle', 'How points work', meritExplainerOpen,
    `<div class="section-sub" style="margin:0;">An even matchup is worth 3 points for a win. Beat a stronger pairing and you earn an extra point for each tier-step difference. Beat a weaker pairing and you earn one point less per tier-step. Merit Points cannot fall below 0 for a win. Draws and losses earn 0.</div>`);

  html += `<div class="fg-toggle" style="margin:8px 0 14px;">
    <button class="fg-toggle-btn ${leagueGrouped?'active':''}" id="meritGroupedBtn">By tier</button>
    <button class="fg-toggle-btn ${!leagueGrouped?'active':''}" id="meritAllBtn">All together</button>
  </div>`;

  // Same temporal rule as the League Table: a match is filed under the tier the
  // player held on its own date, so a mid-month mover appears in both sections
  // holding only what they earned in each.
  const tierAt = (n, d) => historicalTierOf(n, d);

  // Kept so the tier-heading handlers below can ask how many rows a section
  // holds without building the whole table again to count them.
  let meritRowsByTier = null;

  if(leagueGrouped){
    const { table, unresolved } = PerfTrace.time('MeritTable.build',
      ()=> MeritTable.build(matches, tierAt, { tierForRow: tierAt }));
    meritRowsByTier = {};
    table.forEach(r => { if(r.played > 0) meritRowsByTier[r.tier] = (meritRowsByTier[r.tier] || 0) + 1; });
    let anyShown = false;
    TIER_ORDER_LIST.forEach(tier=>{
      const rows = table.filter(r => r.tier === tier && r.played > 0);
      if(rows.length === 0) return;
      anyShown = true;
      const open = tierSectionOpen(meritTierOpen, tier, rows.length);
      html += leagueTierHeading(tier, open).replace('leagueTier', 'meritTier');
      if(open) html += `<div id="meritTierBody${tier}">${buildMeritTableHtml(rows, false)}</div>`;
    });
    if(!anyShown) html += `<div class="section-sub">No games recorded for ${label}.</div>`;
    if(unresolved.length) html += `<div class="section-sub">${unresolved.length} match${unresolved.length===1?'':'es'} could not be scored: a player's tier on that date is unknown.</div>`;
  } else {
    const { table, unresolved } = PerfTrace.time('MeritTable.build', ()=> MeritTable.build(matches, tierAt));
    const rows = table.filter(r => r.played > 0);
    if(rows.length === 0) html += `<div class="section-sub">No games recorded for ${label}.</div>`;
    else html += buildMeritTableHtml(rows, false);
    if(unresolved.length) html += `<div class="section-sub">${unresolved.length} match${unresolved.length===1?'':'es'} could not be scored: a player's tier on that date is unknown.</div>`;
  }

  content.innerHTML = html;
  wireRequestPlayerLinks(content);

  document.getElementById('meritGroupedBtn').onclick = ()=>{ leagueGrouped = true; meritDrill = null; resetMeritTierSections(); renderMeritTable(); };
  document.getElementById('meritAllBtn').onclick = ()=>{ leagueGrouped = false; meritDrill = null; renderMeritTable(); };
  const ex = document.getElementById('meritExplainerToggle');
  if(ex) ex.onclick = ()=>{ meritExplainerOpen = !meritExplainerOpen; renderMeritTable(); };
  content.querySelectorAll('.lg-tier-head').forEach(btn=>{
    btn.onclick = ()=>{
      const t = btn.dataset.tier;
      const rowsHere = (meritRowsByTier && meritRowsByTier[t]) || 0;
      meritTierOpen[t] = !tierSectionOpen(meritTierOpen, t, rowsHere);
      renderMeritTable();
    };
  });
  // Tapping any count -- P, W, D, L, Hard or Fav -- opens the matches behind
  // it; tapping the same one again closes it.
  wireTableCounts(content, ()=> meritDrill, (k)=>{ meritDrill = k; }, renderMeritTable);
}

// ===================== MONTHLY RACE (Best Month) — trial =====================
// A fourth view on the League screen, beside League and Merit, following the
// same month (Meaningful Month) and the same tier-on-the-day split. The
// arithmetic lives in monthlyRace.js and nowhere else; this only draws it.
// Tier-only by design: the race is run against a tier's par, so an "All
// together" table would compare scores measured against different standards.

let raceTierOpen = {};
let raceExplainerOpen = false;
let raceDrill = null; // `${player}\u0000${tier}` -- one open at a time

// The month's approved matches in the order they were played. Order matters:
// a tier's par is built from each player's FIRST pre-match rating of the month.
function raceMatches(month){
  return getAllApprovedMatches()
    .filter(m => m.date.slice(0,7) === month)
    .slice()
    .sort((a,b)=> a.date < b.date ? -1 : a.date > b.date ? 1 : (a.sourceIndex||0) - (b.sourceIndex||0))
    .map(m => ({ id: m.id, date: m.date, winners: m.winners, losers: m.losers,
      isDraw: !!m.isDraw, sets: m.sets }));
}

function buildMonthlyRace(month){
  return MonthlyRace.build({
    matches: raceMatches(month),
    tierAt: (n, d) => historicalTierOf(n, d),
    // The persisted pre-match rating, read back from the journey -- never
    // today's rating and never a second calculation.
    preRating: (id, n) => {
      const f = V3_MATCH_FACTS && V3_MATCH_FACTS[id];
      const p = f && f.byPlayer && f.byPlayer[n];
      return p ? p.preMatchRating : null;
    },
  });
}

function racePoints(v){
  if(v > 0) return '+' + v.toFixed(1);
  if(v < 0) return '−' + Math.abs(v).toFixed(1);
  return '0.0';
}

// The score as the player saw it: their side's games first.
function raceScoreFor(d){
  if(!d.sets || !d.sets.length) return '';
  const flip = d.result === 'L';
  return d.sets.map(([a,b]) => flip ? `${b}-${a}` : `${a}-${b}`).join(' ');
}

function raceDrillRowHtml(d, tier){
  const who = (list) => list.map(p =>
    `${escapeHtml(p.playerId)}<span class="merit-drill-tier">${escapeHtml(p.tier || '?')}</span>`).join(' & ');
  const verb = d.result === 'W' ? 'Won' : d.result === 'D' ? 'Drew' : 'Lost';
  const score = raceScoreFor(d);
  const partner = d.partner.length ? ` with ${who(d.partner)}` : '';
  return `<div class="merit-drill-row race-drill-row">
    <div class="merit-drill-top">
      <span class="merit-drill-date">${escapeHtml(d.date)}</span>
      <span class="merit-drill-pts race-pts ${d.points < 0 ? 'is-neg' : ''}">${racePoints(d.points)}</span>
    </div>
    <div class="merit-drill-teams"><b>${verb}</b>${partner} v ${who(d.opponents)}${score ? ` <span class="race-drill-score">${escapeHtml(score)}</span>` : ''}</div>
    <div class="merit-drill-meta race-drill-meta">Stakes: win ${racePoints(d.stakes.win)} · draw ${racePoints(d.stakes.draw)} · lose ${racePoints(d.stakes.loss)}<br>An ordinary Tier ${escapeHtml(tier)} player wins this ${Math.round(d.parWin*100)}% of the time</div>
  </div>`;
}

function buildRaceTableHtml(rows, ranked){
  let html = `<div class="callout-card" style="padding:0;">
    <table class="merit-table race-table" style="width:100%; border-collapse:collapse; font-size:11px;">
      <thead><tr style="background:var(--bg2); text-align:left;">
      <th style="padding:7px 2px 7px 7px;">#</th>
      <th style="padding:7px 2px;">Player</th>
      <th style="padding:7px 2px; text-align:center;">P</th>
      <th style="padding:7px 2px; text-align:center;">W</th>
      <th style="padding:7px 2px; text-align:center;">D</th>
      <th style="padding:7px 2px; text-align:center;">L</th>
      <th style="padding:7px 7px 7px 3px; text-align:right; color:var(--gold-bright);">Race</th>
      </tr></thead><tbody>`;
  rows.forEach((r,i)=>{
    const key = `${r.playerId}\u0000${r.tier}`;
    const open = raceDrill === key;
    html += `<tr style="border-top:1px solid var(--line);">
      <td style="padding:7px 2px 7px 7px; color:var(--text-dim);">${ranked ? i+1 : '–'}</td>
      <td style="padding:7px 2px;"><span class="request-player-link" data-player="${escapeHtml(r.playerId)}" style="text-decoration:underline; cursor:pointer; font-weight:700;">${escapeHtml(r.playerId)}</span></td>
      <td style="padding:7px 2px; text-align:center;">${r.played}</td>
      <td style="padding:7px 2px; text-align:center; color:var(--green);">${r.wins}</td>
      <td style="padding:7px 2px; text-align:center; color:var(--text-dim);">${r.draws}</td>
      <td style="padding:7px 2px; text-align:center; color:var(--red);">${r.losses}</td>
      <td style="padding:7px 7px 7px 3px; text-align:right;"><button type="button" class="merit-count race-score${open ? ' is-open' : ''}${r.score < 0 ? ' is-neg' : ''}"
        data-player="${escapeHtml(r.playerId)}" data-tier="${escapeHtml(r.tier)}" aria-expanded="${open}">${racePoints(r.score)}</button></td>
    </tr>`;
    if(open){
      html += `<tr class="merit-drill"><td colspan="7" style="padding:0;">
        <div class="merit-drill-body">
          <div class="merit-drill-head">${escapeHtml(r.playerId)} · Tier ${escapeHtml(r.tier)} race · ${r.played} match${r.played===1?'':'es'}</div>
          ${r.matches.map(d => raceDrillRowHtml(d, r.tier)).join('')}
          <div class="race-drill-total">Total ${racePoints(r.score)}</div>
        </div>
      </td></tr>`;
    }
  });
  html += `</tbody></table></div>`;
  return html;
}

function renderMonthlyRace(){
  const content = document.getElementById('summaryContent');
  let html = '';
  if(summaryMonth === 'all'){
    html += `<div class="section-heading" style="margin-top:6px;">🏁 Monthly Race</div>`;
    html += `<div class="section-sub">The race starts again every month. Choose a month to see it.</div>`;
    content.innerHTML = html;
    return;
  }
  const label = monthLabel(summaryMonth);
  const { table, unresolved } = PerfTrace.time('MonthlyRace.build', ()=> buildMonthlyRace(summaryMonth));

  html += `<div class="section-heading" style="margin-top:6px;">🏁 ${label} Monthly Race</div>`;
  html += `<div class="section-sub" style="margin:2px 0 0;">Best Month: harder wins earn more, harder losses cost less.</div>`;
  html += leagueInlineFold('raceExplainerToggle', 'How the race works', raceExplainerOpen,
    `<div class="section-sub" style="margin:0;">Everyone in a tier starts the month on 0. Every match has stakes, set by how hard it was for an ordinary player of your tier with your actual partner against your actual opponents, judged by their Power Ratings going in. Harder wins earn more and harder losses cost less; an even match is +10 for a win and −10 for a loss. The highest score among players with at least ${MonthlyRace.MIN_MATCHES} matches in the tier had the best month. If you change tier during the month, each tier is its own race and starts from 0. Tap a score to see every match behind it.</div>`);

  let anyShown = false;
  const rowsByTier = {};
  TIER_ORDER_LIST.forEach(tier=>{
    const rows = table.filter(r => r.tier === tier);
    if(rows.length === 0) return;
    anyShown = true;
    rowsByTier[tier] = rows.length;
    const open = tierSectionOpen(raceTierOpen, tier, rows.length);
    html += leagueTierHeading(tier, open).replace('leagueTier', 'raceTier');
    if(!open) return;
    const qualified = rows.filter(r => r.qualified);
    const provisional = rows.filter(r => !r.qualified);
    html += `<div id="raceTierBody${tier}">`;
    if(qualified.length) html += buildRaceTableHtml(qualified, true);
    else html += `<div class="race-noq">No qualifier this month</div>`;
    if(provisional.length){
      html += `<div class="race-prov-head">Provisional · fewer than ${MonthlyRace.MIN_MATCHES} matches</div>`;
      html += buildRaceTableHtml(provisional, false);
    }
    html += `</div>`;
  });
  if(!anyShown) html += `<div class="section-sub">No games recorded for ${label}.</div>`;
  if(unresolved.length) html += `<div class="section-sub">${unresolved.length} match${unresolved.length===1?'':'es'} could not be scored: a player's tier or pre-match rating on that date is unknown.</div>`;

  content.innerHTML = html;
  wireRequestPlayerLinks(content);
  const ex = document.getElementById('raceExplainerToggle');
  if(ex) ex.onclick = ()=>{ raceExplainerOpen = !raceExplainerOpen; renderMonthlyRace(); };
  content.querySelectorAll('.lg-tier-head').forEach(btn=>{
    btn.onclick = ()=>{
      const t = btn.dataset.tier;
      raceTierOpen[t] = !tierSectionOpen(raceTierOpen, t, rowsByTier[t] || 0);
      renderMonthlyRace();
    };
  });
  content.querySelectorAll('.race-score').forEach(btn=>{
    btn.onclick = ()=>{
      const key = `${btn.dataset.player}\u0000${btn.dataset.tier}`;
      raceDrill = (raceDrill === key) ? null : key;
      renderMonthlyRace();
    };
  });
}

function renderSummaryInformation(){
  const box = document.getElementById('summaryContent');
  let html = '';

  const stats = computeMonthlySummaryStats(summaryMonth);
  const statsArr = Object.values(stats);
  const label = summaryMonth === 'all' ? 'All Time' : monthLabel(summaryMonth);

  if(statsArr.length === 0){
    html += `<div class="section-sub">No games recorded for ${label}.</div>`;
    box.innerHTML = html;
    return;
  }

  html += `<div class="section-heading" style="margin-top:6px;">📊 ${label} Stats Review</div>`;

  const minGamesForRanked = 3;
  const eligible = statsArr.filter(s=>s.games >= minGamesForRanked);

  const mostGames = topNTied(statsArr, 'games', 3, true);
  const mostWins = topNTied(statsArr.filter(s=>s.games>0), 'points', 3, true);
  const mostLosses = topNTied(statsArr, 'losses', 3, true);
  const lowestWinPct = topNTied(eligible, 'winpct', 3, false);
  const highestWinPct = topNTied(eligible, 'winpct', 3, true);
  const doughnutMax = Math.max(0, ...statsArr.map(s=>s.doughnuts));
  const mostDoughnuts = doughnutMax > 0 ? statsArr.filter(s=>s.doughnuts===doughnutMax).map(s=>s.name) : [];
  const hardestGames = topNTied(eligible, 'hardness', 3, true);
  const playerOfMonth = mostWins.length ? mostWins[0] : null;

  function nameLinks(names){
    return names.map(n=>`<span class="request-player-link" data-player="${n}" style="text-decoration:underline; cursor:pointer;">${n}</span>`).join(' / ');
  }
  function renderGroupList(title, groups, formatFn){
    let h = `<div class="section-heading">${title}</div>`;
    if(groups.length === 0){ h += `<div class="section-sub">Not enough data.</div>`; return h; }
    groups.forEach(g=>{
      h += `<div class="matchup-vs" style="margin-bottom:6px; padding:8px 12px;">${g.rank}. ${nameLinks(g.names)} — ${formatFn(g)}</div>`;
    });
    return h;
  }

  html += renderGroupList('🎾 Most games played', mostGames, g=>`${g.value} game${g.value===1?'':'s'}`);
  html += renderGroupList('🏆 Most wins &amp; highest points', mostWins, g=>{
    const s = stats[g.names[0]];
    return `${s.wins} win${s.wins===1?'':'s'}${s.draws?` · ${s.draws} draw${s.draws===1?'':'s'}`:''} — ${g.value} pts`;
  });
  html += renderGroupList('😬 Most losses', mostLosses, g=>`${g.value} loss${g.value===1?'':'es'}`);
  html += renderGroupList('📉 Lowest win % (highest loss %)', lowestWinPct, g=>`${stats[g.names[0]].losspct}% loser`);
  html += renderGroupList('📈 Highest win %', highestWinPct, g=>`${g.value}% wins`);

  html += `<div class="section-heading">🍩 Most doughnuts received</div>`;
  if(mostDoughnuts.length === 0){
    html += `<div class="section-sub">Nobody got doughnut'd this ${summaryMonth==='all'?'season':'month'}.</div>`;
  } else {
    html += `<div class="matchup-vs" style="padding:8px 12px;">${nameLinks(mostDoughnuts)} — x${doughnutMax}</div>`;
  }

  html += renderGroupList('💪 Hardest games played (avg opponent strength)', hardestGames, g=>`${g.value}`);

  html += `<div class="section-heading">👑 Player of the Month</div>`;
  if(playerOfMonth){
    html += `<div class="matchup-vs" style="text-align:center; padding:16px; font-size:16px;">${nameLinks(playerOfMonth.names)} 🏆</div>`;
  } else {
    html += `<div class="section-sub">Not enough data.</div>`;
  }

  html += `<div class="section-sub" style="padding:8px 2px;">Assumptions: points are 3/win, 1/draw. "Hardest games" is avg opponent strength ÷ 300. Win%/loss% include draws in the denominator. Rankings for win%/loss%/hardest require at least ${minGamesForRanked} games played.</div>`;

  html += `<div class="fg-row" style="margin-top:12px;"><button class="tab-btn active" id="copySummaryBtn" style="width:100%;">📋 Copy as WhatsApp text</button></div>
  <div id="copySummaryMessage" class="section-sub"></div>`;

  box.innerHTML = html;
  wireRequestPlayerLinks(box);

  document.getElementById('copySummaryBtn').onclick = ()=>{
    const text = buildWhatsAppSummaryText(summaryMonth, stats, {mostGames, mostWins, mostLosses, lowestWinPct, highestWinPct, mostDoughnuts, doughnutMax, hardestGames, playerOfMonth});
    const msg = document.getElementById('copySummaryMessage');
    const showFallback = ()=>{
      let ta = document.getElementById('summaryFallbackText');
      if(!ta){
        ta = document.createElement('textarea');
        ta.id = 'summaryFallbackText';
        ta.className = 'fg-select';
        ta.style.width = '100%';
        ta.style.marginTop = '8px';
        ta.rows = 16;
        msg.after(ta);
      }
      ta.value = text;
      msg.textContent = 'Could not copy automatically — tap the text box below, select all, and copy manually.';
    };
    try {
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(()=>{ msg.textContent = 'Copied! Paste it into WhatsApp.'; }).catch(showFallback);
      } else {
        showFallback();
      }
    } catch(e){
      showFallback();
    }
  };
}

function populateSummaryMonthSelect(){
  const sel = document.getElementById('summaryMonthSelect');
  if(!sel) return;
  const months = getAvailableMonths();
  sel.innerHTML = `<option value="all">All time</option>` + months.map(m=>`<option value="${m}" ${m===summaryMonth?'selected':''}>${monthLabel(m)}</option>`).join('');
  sel.value = summaryMonth;
  // A different month is a different set of games: close any open count.
  sel.onchange = (e)=>{ summaryMonthChoice = e.target.value; summaryMonth = e.target.value; leagueDrill = null; meritDrill = null; renderSummary(); };
}

function buildWhatsAppSummaryText(month, stats, groups){
  const label = month === 'all' ? 'All Time' : monthLabel(month);
  const lines = [];
  lines.push(`Please see the ${label} stats review`);
  lines.push('');
  lines.push('*Most games played:*');
  groups.mostGames.forEach(g=> lines.push(`${g.rank}. ${g.names.join(' / ')} ${g.value} games`));
  lines.push('');
  lines.push('*Most wins & highest points*');
  groups.mostWins.forEach(g=>{
    const s = stats[g.names[0]];
    const drawPart = s.draws ? ` ${s.draws} draw${s.draws===1?'':'s'}` : '';
    lines.push(`${g.rank} ${g.names.join(' / ')} ${s.wins} win${s.wins===1?'':'s'}${drawPart} - ${g.value} points`);
  });
  lines.push('');
  lines.push('Most losses');
  groups.mostLosses.forEach(g=> lines.push(`${g.rank}. ${g.names.join(' / ')} ${g.value} losses`));
  lines.push('');
  lines.push('Lowest win %');
  groups.lowestWinPct.forEach(g=>{
    const s = stats[g.names[0]];
    lines.push(`${g.rank}. ${s.losspct}% loser ${g.names.join(' / ')}`);
  });
  lines.push('');
  lines.push('Highest win %');
  groups.highestWinPct.forEach(g=> lines.push(`${g.rank}. ${g.names.join(' / ')} ${g.value}% wins`));
  lines.push('');
  lines.push('Most doughnuts received');
  if(groups.mostDoughnuts.length){
    lines.push(`${groups.mostDoughnuts.join(' / ')}  x${groups.doughnutMax}`);
  } else {
    lines.push('None this time!');
  }
  lines.push('');
  lines.push('Hardest games played');
  groups.hardestGames.forEach(g=> lines.push(`${g.rank}. ${g.names.join(' / ')} ${g.value}`));
  lines.push('');
  lines.push('Player of the month….');
  lines.push(groups.playerOfMonth ? `${groups.playerOfMonth.names.join(' / ')} 🏆🏆🏆` : 'Not enough data');
  return lines.join('\n');
}


// A player's game requests are answered in Play > Requests, by the player
// selected on this device -- never from a profile, which would have let
// whoever opened it answer for its owner (D2, 27 Sep 2026).


// ===================== RECORD HEALTH =====================
// Every rating in the record is derived by replaying the stored matches in
// order. If a replay is ever left half-written, the matches stay intact but the
// derived documents do not, and the app then refuses every edit -- correctly,
// and silently. It says nothing to anyone who is not trying to edit at that
// moment, and nothing is kept.
//
// This notices, and writes it down once. It does not repair: repairing is a
// decision, and it is not one to offer from a phone beside the thing it would
// rewrite.
//
// Costs no read. The record is already in memory, and the check is arithmetic.
// It replays the whole history though -- tens of milliseconds here, a few
// hundred on a phone -- so it runs once a session, after the first render.
async function runRecordHealthCheck(){
  if(healthCheckDone) return null;
  healthCheckDone = true;
  if(typeof ReplayForward === 'undefined' || typeof HealthReport === 'undefined') return null;
  if(!V3_RECORD || !V3_RECORD.matches.length || !V3_RECORD.journey.length) return null;

  let check;
  try { check = ReplayForward.verifyNoOp(V3_RECORD, {}); }
  catch(e){
    // A check that cannot run is not a clean bill of health, but it is also not
    // a divergence, and inventing one would be worse than saying nothing.
    console.error('record health check could not run:', e && e.message);
    return null;
  }
  if(check.identical) return null;

  let repair = null;
  try { repair = ReplayForward.planRepair(V3_RECORD, {}); } catch(e){ /* the counts are optional */ }

  healthReport = HealthReport.buildReport({
    check, repair, record: V3_RECORD,
    seenBy: (currentUserName && currentUserName.trim()) || getCurrentViewer()?.name || null,
  });
  await storeHealthReport(healthReport);
  return healthReport;
}

// One document per distinct divergence. Seeing the same one again updates it
// rather than filing another, so four people opening the app on four phones
// leave one report saying it was seen four times.
async function storeHealthReport(report){
  if(!report || !db) return;
  try {
    const ref = db.collection(HealthReport.COLLECTION).doc(report.id);
    const snap = await ref.get();
    const merged = snap && snap.exists ? HealthReport.merge(snap.data(), report) : report;
    healthReport = merged;
    await ref.set(merged);
  } catch(e){
    // Failing to record it must never break the app for the person who found
    // it. They are told either way; the write is the part that can fail.
    console.error('could not store the health report:', e && e.message);
  }
}

// What a refusal says, and to whom. The board holds an admin password too, so
// "admin" has never meant the owner -- see adminRole.
function recordHealthMessage(){
  if(!healthReport) return '';
  return HealthReport.messageFor(healthReport, { owner: isOwnerAdmin() });
}

async function readStoredRecord(backend){
  const [matches, journey, players] = await Promise.all([
    backend.getAll(RatingStore.COLLECTIONS.matches),
    backend.getAll(RatingStore.COLLECTIONS.journey),
    backend.getAll(RatingStore.COLLECTIONS.players),
  ]);
  return { matches, journey, players };
}


async function init(){
  PerfTrace.mark('boot starts');
  showBootNotice();
  // Everything start-up needs, asked for at once.
  //
  // These fourteen reads -- three collections and eleven single documents --
  // have no dependency on one another at all, and start-up used to await them
  // one after another. Measured against the live record, that was 14 round
  // trips in series: 1.9s on a fast connection, 3.8s at a phone's 250ms, of
  // which 16ms was computation. Fired together they cost one round trip.
  //
  // v3 state still has to be in place before the first recomputeAll, because
  // the application has no rating without it and will not invent one -- and it
  // is, because nothing below runs until every one of these has landed.
  const [ , stored, myName, ownerHash, boardHash, unlocked,
          visibility, requests, areas, challenges, northSouth ] =
    await PerfTrace.timeAsync('load the record', Promise.all([
      loadV3State(),
      loadStoredData(),
      loadMyName(),
      loadPasswordHash(STORAGE_KEY_ADMIN_PW_OWNER),
      loadPasswordHash(STORAGE_KEY_ADMIN_PW_BOARD),
      loadMyUnlocked(),
      loadVisibility(),
      loadGameRequests(),
      loadDevAreas(),
      loadChallenges(),
      loadNorthSouthResults(),
    ]));
  extraMatchesState = stored.extraMatches;
  tagOverridesState = stored.tagOverrides;
  matchEditsState = stored.matchEdits;
  deletedIdsState = stored.deletedIds;
  currentUserName = myName;
  ownerPasswordHash = ownerHash;
  boardPasswordHash = boardHash;
  isUnlocked = unlocked;
  visibilityState = visibility;
  gameRequestsState = requests;
  devAreasState = areas;
  challengesState = challenges;
  northSouthResultsState = northSouth;
  PerfTrace.mark('record ready');
  // Power Rankings opens on the most recently completed month rather than
  // All Time. getAvailableMonths() only needs the raw match state loaded
  // above (not recomputeAll()'s derived PLAYERS/ratings), so this runs
  // first -- recomputeAll() populates #monthSelect from selectedMonth, and
  // it needs to see the real default, not 'all', to render correctly.
  // The monthly min-games default (5, vs 10 for All Time) is applied here
  // too, matching exactly what the month-select's own change handler
  // already does for a manual switch.
  // Start-up is an arrival like any other: Rankings gets its Meaningful Month.
  arriveAtRankings();
  recomputeAll();
  applyTabVisibility();

  // From here on there is a record to draw, and every screen may draw itself.
  DATA_READY = true;
  drawFirstScreen();

  // After the screen exists, never before it. Whoever opens the app finds the
  // problem, so a half-written record is noticed the same day rather than
  // whenever somebody next happens to try an edit.
  const runHealthCheck = ()=>{ runRecordHealthCheck().catch(()=>{}); };
  if(typeof requestIdleCallback === 'function') requestIdleCallback(runHealthCheck, { timeout: 4000 });
  else setTimeout(runHealthCheck, 1200);
}

init();

// Re-render the Requests tab live on a viewer switch, so "Your turn" /
// "Choose Partner" moves to whichever challenge card it now applies to
// without needing a manual tab reload. Also keeps Find Game's Player field
// aligned with the same global identity (see syncFindGamePlayerToViewer).
document.addEventListener('viewerchanged', ()=>{
  if(activeTab === 'wishlist') renderWishlist();
  syncFindGamePlayerToViewer();
});
