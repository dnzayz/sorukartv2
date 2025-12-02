import { Card, UserSettings, ReviewLog, State, Rating, COURSES } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'aceit_settings',
  CARDS: 'aceit_cards',
  LOGS: 'aceit_logs',
};

// Raw CSV Data provided
const ATA_DATA_RAW = `
"Osmanlı tarihi hakkındaki geleneksel “Yükseliş, Duraklama, Gerileme” paradigmasına modern tarih yazımında getirilen eleştiri nedir?",Bu paradigmanın Avrupa merkezci olduğu ve Osmanlı'nın gerilemek yerine askeri bir imparatorluktan bürokratik bir devlete evrildiği görüşü benimsenmektedir.
Modern tarihçilikte 17. ve 18. yüzyıl Osmanlı tarihi nasıl nitelendirilmektedir?,"17. yüzyıl Islahatlar Çağı, 18. yüzyıl ise dönüşüme hazırlık olan Yenileşme Çağı olarak nitelendirilmektedir."
Osmanlı Devleti'nin 1923'te yıkıldığı tezi yerine hangi yaklaşım daha doğru kabul edilir?,"Devletin yıkılmadığı, Cumhuriyet'in ilanı ile Osmanlı Hanedanlığının tasfiye edilerek bir rejim değişikliği yaşandığı ve devletin hanedanlıktan ulus devlete dönüştüğü yaklaşımıdır."
16. yüzyıldan itibaren Osmanlı ekonomisini olumsuz etkileyen temel ticaret rotalarındaki eksen değişikliği nedir?,Dünya ticaret yollarının Akdeniz'den Atlantik kıyılarına doğru yer değiştirmesidir.
Amerika'dan gelen bol miktarda gümüşün Avrupa ve Osmanlı ekonomisi üzerindeki temel etkisi ne olmuştur?,Gümüş para bolluğuna ve gıda ürünleri başta olmak üzere fiyatların artışına (enflasyonist dönem) sebep olmuştur.
"II. Osman'ın Yeniçeriler tarafından katledilmesi, Osmanlı egemenlik anlayışında nasıl bir değişime yol açmıştır?",Dokunulmaz sultan imgesini yıkarak padişahın meşruiyetini sarsmıştır.
"Padişahın, Yeniçeriler ve onlarla ittifak yapan ulemaya karşı devleti dönüştürme arayışında hangi sınıfı merkeze almıştır?",Kalemiye sınıfını merkeze alarak devleti modern anlamda bürokratik bir devlete dönüştürmeyi amaçlamıştır.
1703 tarihli Edirne Vakası'nın Osmanlı siyasi tarihindeki önemi nedir?,Sultanın meşruiyet krizini doruğa çıkarmış ve ilk defa Osmanlı Hanedanı'na alternatif yeni saltanat arayışları görülmüştür.
Osmanlı tarihinde ilk kez sultanın oğlu yerine kardeşinin tahta çıkmasına neden olan ve veraset sistemini değiştiren Valide Sultan kimdir?,"Kösem Sultan, oğlu II. Osman yerine I. Mustafa'yı tahta çıkartarak bu değişikliğe neden olmuştur."
II. Selim'den itibaren Osmanlı sultanlarının ordunun başında sefere çıkmamaları ve sancaklarda valilik yapmamaları ne gibi sonuçlar doğurmuştur?,Devlet ve halktan kopmalarına neden olmuştur.
"Tımar sisteminin bozulmasıyla tımarların iltizama dönüşmesi ve mültezimlerin vergi toplamak için _____ ile işbirliği yapması, merkezi yönetimin zayıflamasına neden olmuştur.",âyanlarla
Ağır vergiler yüzünden toprağını terk edip büyük şehirlere göç eden Anadolu köylüsüne ne ad verilirdi?,Çiftbozan
Medrese mezunu öğrencilerin iş bulamayınca yol kesme ve soyguna başlamalarıyla ortaya çıkan isyanlara ne denir?,Suhte İsyanları
Osmanlı'da devlet kurumlarındaki çözülmeleri belirten ve siyasi eleştiri niteliğindeki eser türüne ne ad verilir?,Nasihatname
IV. Murad'a sunduğu layiha ile devletin kötü gidişini ifade eden ve 17. yüzyılın önemli ıslahat düşünürlerinden olan kişi kimdir?,Koçi Bey
Kâtip Çelebi'nin medreselerin çöküntü içinde olduğunu ve ıslahının kaçınılmaz olduğunu belirttiği eseri hangisidir?,Mizanü'l-Hak
Osmanlı İmparatorluğu'nu askeri bir imparatorluktan bürokratik bir devlete dönüştürmeyi hedefleyen kâtip sınıfının ilk kuşağına ne ad verilir?,Çelebiler Çağı
"Mustafa Reşit Paşa, Âli Paşa, Fuat Paşa, Şinasi ve Namık Kemal gibi aydınların içinde bulunduğu ve imparatorluğu bürokratik-parlamenter monarşiye dönüştürmeye çalışan kuşak hangisidir?",Münevverler (Aydınlar) Çağı
Mustafa Kemal Atatürk ve silah arkadaşlarının içinde bulunduğu ve Yeni Osmanlılar ile Jön Türklerden etkilenen kuşak hangi isimle anılır?,Kahramanlar Çağı
"Osmanlı tarihinde ""Nizam-ı Cedit"" terimini ilk kez kullanan ve değişmez düzen karşısında yeni düzen anlayışını dile getiren yazar kimdir?",İbrahim Müteferrika
"Yirmisekiz Çelebi Mehmet'in Paris sefareti sonrası getirdiği şehir planlarıyla Kâğıthane'de yaptırılan köşkler ve bahçeler, hangi dönemin simgesi olmuştur?",Lale Devri
Lale Devri'ni sona erdiren olay hangisidir?,Patrona Halil İsyanı (1730)
Mühendishane-i Bahr-i Hümayun ve Mühendishane-i Berr-i Hümayun'un öncüsü olan Hendesehane hangi padişah döneminde kurulmuştur?,I. Mahmut
III. Mustafa Dönemi'nde Sürat Topçuları Ocağı'nın kurulması gibi askeri yenileşme çabalarının öncü ismi olan yabancı uzman kimdir?,Baron de Tott
III. Selim dönemindeki yeniliklerin genel adı nedir?,Nizam-ı Cedit
III. Selim'in Viyana sefiri Ebubekir Ratib Efendi'ye göre Avrupalı devletlerin büyüklüğünün altında yatan temel unsurlar nelerdir?,"Düzenli bir ordu, dolu bir hazine, dürüst memurlar, halkın eğitimi, güvenliği ve refahı."
Osmanlı modernleşmesinin ana gövdesini oluşturan ve 1795'te Hasköy'de açılan askeri okul hangisidir?,Mühendishane-i Berr-i Hümayun
"Osmanlı Devleti'nin 1793'te Londra, Paris, Viyana ve Berlin'de daimi ikamet elçilikleri kurmasının temel amacı neydi?","Avrupa'daki siyasi, ekonomik, askeri ve bilimsel gelişmeleri yakından takip etmek."
III. Selim ve Nizam-ı Cedit dönemini sona erdiren isyanın lideri kimdir?,Kabakçı Mustafa
"Padişahın yetkilerini sınırlayan ve ayanlarla padişah arasında imzalanan, Magna Carta'ya benzetilen belge hangisidir?",Sened-i İttifak (1808)
Sened-i İttifak'ın imzalanmasını sağlayan ve II. Mahmut'u tahta çıkaran Rusçuk âyanı kimdir?,Alemdar Mustafa Paşa
1826'da Yeniçeri Ocağı'nın kaldırılması olayına ne ad verilir?,Vaka-i Hayriye
Yeniçeri Ocağı'nın kaldırılmasından sonra II. Mahmut tarafından kurulan yeni ordunun adı nedir?,Asakir-i Mansure-i Muhammediyye
Osmanlı Devleti'nin ilk resmî gazetesi olan ve II. Mahmut döneminde yayımlanmaya başlayan gazetenin adı nedir?,Takvim-i Vekayi
II. Mahmut döneminde Divan-ı Hümayun'un yerine kurulan modern yönetim birimleri hangileridir?,Nezaretler (Bakanlıklar)
"3 Kasım 1839'da Gülhane Parkı'nda okunan ve can, mal, ırz güvenliği gibi temel hakları güvence altına alan ferman hangisidir?",Tanzimat Fermanı (Gülhane Hatt-ı Hümayunu)
Tanzimat Fermanı'nın ilan edilmesinde öncü rol oynayan ve dönemin Hariciye Nazırı olan devlet adamı kimdir?,Mustafa Reşit Paşa
"Hem Tanzimat hem de Islahat Fermanı'nın temelini oluşturan görüşleri ""Avrupa Ahvaline Dair Risale""de ifade eden ve Osmanlıcılık fikrinin öncüsü sayılan devlet adamı kimdir?",Sadık Rıfat Paşa
Kırım Savaşı (1853-1856) sonrasında ilan edilen ve gayrimüslim tebaanın haklarını Müslümanlarla eşitleyerek vatandaşlık yolunda önemli bir adım olan ferman hangisidir?,Islahat Fermanı (1856)
"1865-1876 yılları arasında hürriyet ve anayasa talepleriyle idareye karşı muhalefet eden ve Namık Kemal, Ziya Paşa gibi aydınlardan oluşan topluluğa ne ad verilir?",Yeni Osmanlılar (Genç Osmanlılar)
Osmanlı tarihinin ilk anayasası olan ve 23 Aralık 1876'da ilan edilen anayasanın adı nedir?,Kanun-i Esasi
1876 Kanun-ı Esasi'sinin 113. maddesi padişaha hangi yetkiyi veriyordu?,Hükümetin emniyetini ihlal ettikleri sabit olan kişileri sürgüne gönderme yetkisi.
II. Abdülhamit'in 1877-1878 Osmanlı-Rus Savaşı'nı gerekçe göstererek meclisi tatil etmesiyle başlayıp 1908'e kadar süren döneme ne ad verilir?,İstibdat Dönemi
II. Abdülhamit'in mutlak monarşisine karşı parlamenter monarşiyi yeniden kurmak amacıyla muhalefet yürüten ve Yeni Osmanlıların halefleri olan grup kimlerdir?,Jön Türkler
Selanik ve Manastır'da örgütlenerek 24 Temmuz 1908'de II. Abdülhamit'e meşrutiyeti yeniden ilan ettiren cemiyet hangisidir?,İttihat ve Terakki Cemiyeti
1909'da yapılan anayasa değişikliği ile padişahın sürgün yetkisi (113. madde) kaldırılmış ve tahta çıkarken _____ önünde yemin etme şartı getirilmiştir.,Meclis-i Umumi
Meclis tarafından padişahlığı onaylanan ve mecliste yemin eden ilk Osmanlı padişahı kimdir?,V. Mehmet Reşat
"Emperyalist devletlerin Osmanlı Devleti'nin topraklarını paylaşma planlarına verilen ve ""Türklerin Avrupa'dan atılması"" şeklinde de tanımlanan siyasi terim nedir?",Şark Meselesi (Doğu Sorunu)
"Rusya'nın ""Boğazları ele geçirme ve sıcak denizlere inme"" politikasının mimarı olan Rus Çarı kimdir?",Çar I. Petro
"Kırım Savaşı öncesinde Osmanlı Devleti için ""Hasta Adam"" tabirini kullanan ve mirasını paylaşmayı teklif eden ülke hangisidir?",Rusya
19. yüzyılda İngiltere'nin Osmanlı Devleti'nin toprak bütünlüğünü savunmasının temel nedeni neydi?,Hindistan'a giden yolların güvenliğini sağlamak ve Rusya'nın güneye yayılmasını önlemek.
"Osmanlı Devleti'nin, topraklarını tek başına koruyamayacağını anlayarak büyük devletler arasındaki çıkar çatışmalarından yararlanma politikasına ne denir?",Denge Politikası
Almanya'nın Osmanlı Devleti'nin toprak bütünlüğünü savunmasının ve Bağdat demiryolu gibi projelerle yakınlaşmasının ardındaki stratejik hedefi neydi?,İngiltere'nin Hindistan sömürgelerine giden Orta Doğu bölgesinde üstünlüğü ele geçirmek.
I. Dünya Savaşı'nın çıkmasına bahane olan Saraybosna suikastının (28 Haziran 1914) temelinde hangi kriz yatmaktadır?,Avusturya-Macaristan'ın Bosna-Hersek'i ilhak etmesiyle (1908) başlayan Balkan bunalımı.
"İtalya'nın Trablusgarp'a saldırması üzerine Mustafa Kemal gibi gönüllü Osmanlı subaylarının bölgeye giderek yerel direnişi örgütlemesi, hangi savaşın ilk provası olarak görülür?",Türklerin Anadolu'da verecekleri Millî Mücadele'nin.
Yunanistan'ın Bizans İmparatorluğu'nu yeniden canlandırma ve genişleme idealine ne ad verilir?,Megalo İdea
Rusya'nın teşvikiyle Osmanlı Devleti'ne karşı birleşen Balkan devletleri hangileridir?,"Bulgaristan, Sırbistan, Yunanistan ve Karadağ."
"Almanya, Avusturya-Macaristan ve İtalya arasında 1882'de kurulan askeri blok hangisidir?",Üçlü İttifak (Bağlaşma Devletleri)
"İngiltere, Fransa ve Rusya arasında Almanya'ya karşı 1907'de şekillenen askeri blok hangisidir?",Üçlü İtilaf (Anlaşma Devletleri)
"Osmanlı Devleti sınırları içinde din, dil, ırk farkı gözetmeksizin bütün tebaayı eşit vatandaşlık temelinde birleştirerek bir ""Osmanlı milleti"" yaratmayı amaçlayan fikir akımı hangisidir?",Osmanlıcılık
"Hangi olay, Osmanlıcılık ideolojisinin iflas ettiğinin en somut göstergesi olarak kabul edilir?",Balkan Savaşları'nda Hristiyan Balkan milletlerinin Osmanlı'dan ayrılması.
"Mehmed Âkif, Said Halim Paşa gibi düşünürlerin öncülük ettiği ve devletin kurtuluşunu İslam dünyasının birliğinde ve İslami değerlere dönmekte gören fikir akımı hangisidir?",İslamcılık (Panislamizm)
II. Meşrutiyet döneminde İslamcı aydınların düşüncelerini tartıştıkları en önemli yayın organlarından biri olan derginin adı nedir?,Sırat-ı Müstakim (daha sonra Sebîlürreşâd)
"Gaspıralı İsmail Bey'in ""Dilde, Fikirde, İşte Birlik"" sloganıyla özetlediği ve Ziya Gökalp tarafından sistemleştirilen, kurtuluşu Türk milli kimliğinde gören fikir akımı hangisidir?",Türkçülük
"Yusuf Akçura'nın, Osmanlı Devleti'nin önündeki siyasi seçenekleri analiz ettiği ve Türk milliyetçiliğini en anlamlı alternatif olarak sunduğu meşhur makalesinin adı nedir?",Üç Tarz-ı Siyaset
"Ziya Gökalp'in Türkçülük düşüncesini özetlediği ve ""Türk-İslam harsı"" tezini işlediği ünlü eseri hangisidir?","Türkleşmek, İslâmlaşmak, Muasırlaşmak"
"Abdullah Cevdet gibi düşünürlerin savunduğu ve Osmanlı Devleti'nin kurtuluşunun Batı medeniyetini ""gülü ve dikeni ile"" bir bütün olarak almaktan geçtiğini öne süren fikir akımı hangisidir?",Batıcılık (Garpçılık)
Batıcı aydınların fikirlerini savundukları ve Abdullah Cevdet tarafından çıkarılan derginin adı nedir?,İçtihat
"Kılıçzade Hakkı'nın 1913'te kaleme aldığı ve fesin kaldırılması, Latin alfabesinin kabulü gibi inkılapları öngören ütopik yazısının başlığı nedir?",Pek Uyanık Bir Uyku
"II. Meşrutiyet döneminde ortaya çıkan Osmanlıcılık, İslamcılık, Türkçülük ve Batıcılık fikir akımlarının ortak amacı neydi?",Osmanlı Devleti'ni içinde bulunduğu kötü durumdan kurtarmak.
"Osmanlı Devleti'nin 1908-1918 yılları arasındaki dönemi, Türk tarihçiliğinde ne olarak adlandırılır?",II. Meşrutiyet Devri olarak adlandırılır.
"Meşrutiyet kelimesi, 19. yüzyılın ikinci yarısından itibaren Osmanlı siyasi hayatında hangi rejim karşılığında kullanılmıştır?",Anayasalı ve meclisli saltanat-hilafet rejimi karşılığında kullanılmıştır.
Kanun-ı Esasi'nin ilan edildiği 23 Aralık 1876'dan Meclis-i Mebusanın tatil edildiği 13 Şubat 1878'e kadarki döneme ne denir?,I. Meşrutiyet denmektedir.
23-24 Temmuz 1908'den 30 Ekim 1918 Mondros Mütarekesi'ne kadar olan döneme ne ad verilir?,II. Meşrutiyet denmektedir.
23 Temmuz 1908'de II. Meşrutiyet'in ilan edilmesinde en büyük rolü oynayan cemiyet hangisidir?,İttihat ve Terakki Cemiyeti'dir.
31 Mart Vakası (13 Nisan 1909) hangi siyasi güce bir tepki olarak başlamıştır?,İttihat ve Terakki Cemiyetine bir tepki olarak başlamıştır.
14 Eylül 1908'de İttihat ve Terakki karşıtları tarafından kurulan siyasi fırka hangisidir?,Ahrar Fırkası'dır.
II. Meşrutiyet'in ilanından sonra 5 Ekim 1908'de Avusturya-Macaristan hangi Osmanlı toprağını sınırlarına katmıştır?,Bosna-Hersek'i sınırlarına katmıştır.
"5 Ekim 1908'de Bulgaristan, Osmanlı Devleti'nden ayrılarak ne ilan etmiştir?",Bağımsızlığını ilan etmiştir.
"İttihatçılar, Meşrutiyet'in muhafazası gerekçesiyle hangi askeri birliği Selanik'ten İstanbul'a getirtmişlerdir?",Üçüncü Ordu'ya bağlı Avcı Taburlarını getirtmişlerdir.
31 Mart Vakası'nın başlamasına neden olan ve 7 Nisan 1909'da öldürülen Serbestî gazetesi başyazarı kimdir?,Hasan Fehmi'dir.
31 Mart Ayaklanması'nı (13 Nisan 1909) başlatan askerler hangi taleple isyan etmişlerdir?,Şeriat talebiyle ayaklanmışlardır.
31 Mart Vakası sırasında isyancılara katılan ve Volkan gazetesinin sahibi olan kişi kimdir?,Derviş Vahdeti'dir.
"31 Mart Olayları sırasında isyancıların başlıca taleplerinden biri, hangi cemiyetin ilga edilmesiydi?",İttihat ve Terakki Cemiyeti'nin ilga edilmesiydi.
"31 Mart Vakası'nı bastırmak için Selanik'ten gelen, II. ve III. Ordunun askerlerinden oluşan birliğe ne ad verilmiştir?",Hareket Ordusu adı verilmiştir.
Hareket Ordusu'nun kumandasını Yeşilköy'de devralan Paşa kimdir?,Mahmut Şevket Paşa'dır.
31 Mart Olayları sonucunda Meclis kararı ve Şeyhülislam fetvasıyla 27 Nisan 1909'da tahttan indirilen padişah kimdir?,II. Abdülhamit'tir.
II. Abdülhamit'in tahttan indirilmesinden sonra yerine geçen padişah kim olmuştur?,V. Mehmet Reşat tahta geçmiştir.
Osmanlı İttihat ve Terakki Cemiyeti'nin temelleri 1889'da hangi okulda atılmıştır?,Tıp Fakültesi'nde atılmıştır.
Osmanlı İttihat ve Terakki Cemiyeti'nin kurucuları arasında yer alan Tıp Fakültesi öğrencileri kimlerdir?,"İbrahim Temo öncülüğünde Abdullah Cevdet, İshak Sükûtî ve Mehmet Reşit'tir."
"Ahmet Rıza Bey, İttihat ve Terakki Cemiyeti adına 1 Aralık 1895'te Paris'te hangi dergiyi yayımlamaya başlamıştır?",Meşveret dergisini yayımlamaya başlamıştır.
"Cemiyetin 1902'de Paris'te toplanan ilk kongresinde, hangi konu üzerindeki anlaşmazlık nedeniyle iki muhalif grup ortaya çıkmıştır?",Rejim değişikliğinin gerçekleştirilmesi sürecinde yabancı müdahalesinin talep edilip edilmemesi hususundaki anlaşmazlık.
"Adem-i merkeziyetçiliği savunan Prens Sabahattin, 1902 kongresinden sonra hangi cemiyeti kurmuştur?",Osmanlı Hürriyetperveran Cemiyeti'ni kurmuştur.
İngiliz Kralı VII. Edward ile Rus Çarı II. Nikola'nın 1908'de gerçekleştirdiği ve İttihat ve Terakki'nin eylemlerini hızlandıran görüşme hangisidir?,Reval görüşmesidir.
"İttihat ve Terakki'nin silahlı eylemleri sonucunda Sultan II. Abdülhamit, 23 Temmuz 1908'de neyi ilan etmek zorunda kalmıştır?",Kanun-ı Esasi'yi yeniden yürürlüğe koyup II. Meşrutiyet'i ilan etmek zorunda kalmıştır.
"İttihat ve Terakki Cemiyeti, hangi olay üzerine 23 Ocak 1913'te bir darbe ile (Babıâli Baskını) yönetimi tamamen ele geçirmiştir?",Balkan Savaşı'nın yarattığı çöküntü ve Edirne'nin Bulgarlara teslim edileceği şayiaları üzerine.
"Sadrazam Mahmut Şevket Paşa'ya düzenlenen suikast, İttihat ve Terakki'nin nasıl bir yönetim kurmasına yol açmıştır?",Muhalefeti sindirerek bir tek parti yönetimi kurmasına yol açmıştır.
"İttihat ve Terakki Cemiyeti, son kongresini 1 Kasım 1918'de toplayarak kendisini feshetmiş ve hangi ismi almıştır?",Teceddüt Fırkası ismini almıştır.
İtalya'nın sömürgecilik siyaseti sonucu Osmanlı Devleti ile 1911-1912 yılları arasında yaptığı savaş hangisidir?,Trablusgarp Savaşı'dır.
Trablusgarp Savaşı'nda Osmanlı Devleti'nin bölgeye takviye kuvvet gönderememesinin temel nedeni neydi?,Libya ile kara bağlantısının olmaması ve Çanakkale Boğazı'nın İtalyan donanması tarafından kapatılması.
Trablusgarp'a gönüllü olarak giden subaylar arasında yer alan ve daha sonra Türkiye Cumhuriyeti'nin kurucusu olan kişi kimdir?,Kolağası Mustafa Kemal Bey (ATATÜRK).
Trablusgarp'taki yerli halkı İtalyan işgaline karşı örgütleyen Osmanlı subayları hangi yerel tarikattan destek almıştır?,Senusilerden destek almışlardır.
Trablusgarp Savaşı'nı sona erdiren ve 15-18 Ekim 1912'de imzalanan antlaşma hangisidir?,Uşi (Ouchy) Antlaşması'dır.
Uşi Antlaşması ile Osmanlı Devleti hangi son Kuzey Afrika toprağını kaybetmiştir?,Trablusgarp ve Bingazi'yi kaybetmiştir.
"Uşi Antlaşması'na göre, Balkan Savaşı tehlikesine karşı _____ geçici olarak İtalya'ya bırakılmıştır.",Rodos ve 12 Ada
Balkan devletlerinin Osmanlı'nın Avrupa'daki topraklarını ele geçirmek için Rusya'nın öncülüğünde ittifak kurması hangi savaşın temel nedenidir?,Birinci Balkan Savaşı'nın temel nedenidir.
Birinci Balkan Savaşı hangi devletin 8 Ekim 1912'de Osmanlı'ya savaş ilanıyla başlamıştır?,Karadağ'ın savaş ilanıyla başlamıştır.
"Birinci Balkan Savaşı sırasında Osmanlı ordusunun hazırlıksız yakalanmasının nedenlerinden biri, subayların ordu yerine ne ile uğraşmasıydı?",Subayların politika ve komitacılıkla uğraşmasıydı.
Birinci Balkan Savaşı'nı sona erdiren ve 30 Mayıs 1913'te imzalanan antlaşma hangisidir?,Londra Barış Antlaşması'dır.
Londra Barış Antlaşması'na göre Osmanlı Devleti'nin batı sınırı olarak belirlenen hat hangisidir?,Midye-Enez hattıdır.
İkinci Balkan Savaşı'nın temel nedeni nedir?,Balkan devletlerinin Osmanlı'dan aldıkları toprakları paylaşamamalarıdır.
"Osmanlı Devleti, İkinci Balkan Savaşı sırasında Bulgaristan'ın diğer Balkan devletleriyle savaşmasından yararlanarak hangi şehri geri almıştır?",Edirne'yi geri almıştır.
Osmanlı Devleti ile Bulgaristan arasında İkinci Balkan Savaşı sonrası imzalanan ve Meriç Nehri'ni sınır kabul eden antlaşma hangisidir?,29 Eylül 1913 tarihli İstanbul Barış Antlaşması'dır.
Osmanlı Devleti'nin Yunanistan ile imzaladığı 14 Kasım 1913 tarihli Atina Antlaşması ile Girit'in hangi devlete ait olduğu kabul edilmiştir?,Girit'in Yunanistan'a ait olduğu resmen kabul edilmiştir.
"Birinci Dünya Savaşı öncesinde Almanya, İtalya ve Avusturya-Macaristan arasında kurulan blok hangisidir?",Üçlü İttifak bloğudur.
"Üçlü İttifak'a karşı İngiltere, Fransa ve Rusya tarafından kurulan blok hangisidir?",Üçlü İtilaf devletleri grubudur.
Birinci Dünya Savaşı'nı başlatan kıvılcım olarak kabul edilen olay nedir?,Avusturya Veliahtı Franz Ferdinand'ın Saraybosna'da bir Sırp milliyetçisi tarafından öldürülmesidir (28 Haziran 1914).
"Savaşın başında İngiltere'nin, parasını peşin ödediği halde Osmanlı Devleti'ne teslim etmediği iki savaş gemisinin adları nedir?",Sultan Osman-ı Evvel ve Reşadiye gemileridir.
Osmanlı Devleti'nin Birinci Dünya Savaşı'na fiilen girmesine neden olan olay nedir?,Yavuz (Goeben) ve Midilli (Breslau) gemilerinin de içinde olduğu Osmanlı filosunun 29 Ekim 1914'te Karadeniz'deki Rus limanlarını bombalamasıdır.
"Almanya'nın Osmanlı Devleti'ni kendi yanında savaşa sokmak istemesinin temel hedeflerinden biri, halifeliğin manevi gücünü kullanarak neyi amaçlamasıydı?",İngiliz ve Fransız sömürgelerindeki Müslümanları ayaklandırmayı amaçlamasıydı.
Osmanlı Devleti'nin Birinci Dünya Savaşı'nda müttefiklerine yardım etmek için asker gönderdiği cepheler hangileridir?,"Galiçya, Romanya ve Makedonya Cepheleridir."
"Enver Paşa komutasındaki Osmanlı ordusunun, kış şartları nedeniyle binlerce askerini donarak kaybettiği felaketle sonuçlanan harekât hangisidir?",Sarıkamış Harekâtı'dır (Aralık 1914).
"1917'de Rusya'da Bolşevik İhtilali'nin çıkması, Osmanlı Devleti'nin hangi cephesindeki savaşın sona ermesini sağlamıştır?",Kafkasya (Doğu) Cephesi'ndeki savaşın sona ermesini sağlamıştır.
"3 Mart 1918'de imzalanan hangi antlaşma ile Rusya, Kars, Ardahan ve Batum'u Osmanlı Devleti'ne geri vermiştir?",Brest-Litovsk Antlaşması ile geri vermiştir.
"Osmanlı Devleti'nin, İngilizlerin Hindistan sömürge yolunu kesmek amacıyla açtığı taarruz cephesi hangisidir?",Kanal Cephesi'dir.
"İtilaf Devletleri'nin Çanakkale Cephesi'ni açmaktaki temel amaçlarından biri, hangi müttefiklerine askeri yardım ulaştırmaktı?",Rusya'ya askeri yardım ulaştırmaktı.
"18 Mart 1915'te İtilaf donanmasının Çanakkale Boğazı'nı geçemeyerek ağır kayıplar verdiği zafer, tarihe ne olarak geçmiştir?",Çanakkale Deniz Zaferi olarak geçmiştir.
"Çanakkale Deniz Zaferi'nin kazanılmasında, Erenköy Koyu'na döşediği mayınlarla büyük rol oynayan geminin adı nedir?",Nusret mayın gemisidir.
"Çanakkale kara savaşları, İtilaf Devletleri'nin hangi tarihte Gelibolu Yarımadası'na asker çıkarmasıyla başlamıştır?",25 Nisan 1915'te başlamıştır.
"Arıburnu'nda düşman ilerleyişini ""Ben size taarruzu emretmiyorum, ölmeyi emrediyorum!"" diyerek durduran 19. Tümen Komutanı kimdir?",Yarbay Mustafa Kemal Bey'dir.
"Mustafa Kemal Bey'in, Conkbayırı ve Kireçtepe'de zaferler kazanarak ""Anafartalar Kahramanı"" unvanını aldığı cephe hangisidir?",Çanakkale Cephesi'dir.
"İngilizlerin, Hicaz Emiri Şerif Hüseyin'e bağımsız bir Arap krallığı vaat ederek Osmanlı'ya karşı isyan ettirmesi hangi cepheyi olumsuz etkilemiştir?",Suriye-Filistin ve Hicaz-Yemen Cephelerini olumsuz etkilemiştir.
İngiltere Dışişleri Bakanı Arthur Balfour'un 2 Kasım 1917'de yayımladığı ve Filistin'de bir Yahudi devleti kurulmasını vadeden belge nedir?,Balfour Deklarasyonu'dur.
"Mondros Mütarekesi'ne rağmen Medine'yi teslim etmeyerek ""Medine Müdafii"" olarak anılan Osmanlı komutanı kimdir?",Fahrettin Paşa'dır.
"Irak Cephesi'nde Halil (Kut) Paşa komutasındaki Osmanlı ordusunun, İngiliz kuvvetlerini kuşatarak komutanlarıyla birlikte esir aldığı zafer hangisidir?",Kutü'l-Amâre Zaferi'dir (29 Nisan 1916).
"İtilaf Devletleri'nin, Birinci Dünya Savaşı sırasında Osmanlı Devleti'ni paylaşmak için yaptıkları gizli antlaşmaların en bilineni hangisidir?",Sykes-Picot Antlaşması'dır (1916).
"Sykes-Picot Antlaşması'na göre, Adana ve Suriye kıyıları hangi devlete bırakılacaktı?",Fransa'ya bırakılacaktı.
"Sykes-Picot Antlaşması'na göre, Bağdat ve Basra'yı içine alan Güney Irak hangi devletin nüfuzuna verilecekti?",İngiltere'nin nüfuzuna verilecekti.
"İzmir ve çevresinin İtalya'ya verilmesini öngören, ancak Rusya'nın onayı alınamadığı için yürürlüğe girmeyen gizli antlaşma hangisidir?",St. Jean de Maurienne Antlaşması'dır (1917).
ABD Başkanı Woodrow Wilson'un 8 Ocak 1918'de yayımladığı ve savaş sonrası barışın esaslarını belirleyen prensipler nelerdir?,Wilson İlkeleri'dir.
"Wilson İlkeleri'nin Osmanlı Devleti ile ilgili olan 12. maddesi, Türklerin çoğunlukta olduğu bölgelerde neyi öngörüyordu?",Türk kesimlerine güvenli bir egemenlik tanınmasını öngörüyordu.
Osmanlı Devleti'nin Birinci Dünya Savaşı'ndan çekildiği 30 Ekim 1918 tarihli ateşkes antlaşması hangisidir?,Mondros Ateşkes Antlaşması'dır.
Mondros Ateşkes Antlaşması'nı Osmanlı Devleti adına imzalayan heyetin başkanı kimdir?,Bahriye Nazırı Rauf Bey'dir (Orbay).
Mondros Ateşkes Antlaşması'nın 7. maddesi İtilaf Devletleri'ne hangi hakkı tanıyordu?,Güvenliklerini tehdit eden bir durum halinde herhangi bir stratejik noktayı işgal etme hakkını tanıyordu.
"Mondros Ateşkes Antlaşması'nın 24. maddesi, Vilayet-i Sitte'de (Altı Vilayet) bir karışıklık çıkarsa İtilaf Devletleri'ne ne hakkı veriyordu?",Bu vilayetleri işgal etme hakkını veriyordu.
Almanya ile Birinci Dünya Savaşı'nı bitiren barış antlaşması hangisidir?,Versailles (Versay) Barış Antlaşması'dır (28 Haziran 1919).
Avusturya-Macaristan İmparatorluğu'nun parçalanmasıyla Avusturya ile imzalanan barış antlaşmasının adı nedir?,Saint-Germain Barış Antlaşması'dır (10 Eylül 1919).
Bulgaristan ile imzalanan ve Ege Denizi ile bağlantısını kesen barış antlaşması hangisidir?,Neuilly (Nöyi) Barış Antlaşması'dır (27 Kasım 1919).
`;

// Helper to parse CSV simply
const parseCSV = (text: string): {q: string, a: string}[] => {
    const lines = text.trim().split('\n');
    const result: {q: string, a: string}[] = [];
    
    // Very basic regex to handle quoted CSV parts
    const regex = /(?:^|,)("(?:[^"]|"")*"|[^,]*)/g;
    
    for (const line of lines) {
        if (!line.trim()) continue;
        const matches = [];
        let match;
        // reset regex
        const r = new RegExp(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
        while ((match = r.exec(line)) !== null) {
            if (match[1] !== undefined) {
                 matches.push(match[1].replace(/^"|"$/g, '').replace(/""/g, '"'));
            }
        }
        // Expecting at least 2 columns
        if (matches.length >= 2) {
            result.push({ q: matches[0], a: matches[1] });
        }
    }
    return result;
};


// Generate Mock Cards
const generateMockCards = (courseId: string, courseName: string): Card[] => {
  const cards: Card[] = [];
  
  if (courseId === 'ata101') {
      const parsedData = parseCSV(ATA_DATA_RAW);
      const totalQuestions = parsedData.length;
      const cardsPerUnit = Math.ceil(totalQuestions / 8);

      for (let i = 0; i < totalQuestions; i++) {
          const unit = Math.floor(i / cardsPerUnit) + 1;
          if (unit > 8) break; // Should not happen with math.ceil but safety
          
          cards.push({
            id: `${courseId}-u${unit}-c${i}`,
            courseId,
            unit,
            question: parsedData[i].q,
            answer: parsedData[i].a,
            state: State.New,
            due: 0,
            stability: 0,
            difficulty: 0,
            elapsed_days: 0,
            scheduled_days: 0,
            reps: 0,
            lapses: 0,
            last_review: 0,
            isFavorite: false,
            isCustom: false,
          });
      }
      return cards;
  }

  // 8 Units
  for (let unit = 1; unit <= 8; unit++) {
    // Generate 5 cards per unit
    for (let i = 1; i <= 5; i++) {
      cards.push({
        id: `${courseId}-u${unit}-c${i}`,
        courseId,
        unit,
        question: `${courseName} - Ünite ${unit} için Soru ${i}`,
        answer: `Bu, ${courseName} dersinin ${unit}. Ünitesindeki ${i}. sorunun cevabıdır. Konuyu açıklar.`,
        state: State.New,
        due: 0,
        stability: 0,
        difficulty: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        last_review: 0,
        isFavorite: false,
        isCustom: false,
      });
    }
  }
  return cards;
};

export const StorageService = {
  getSettings: (): UserSettings | null => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  },

  saveSettings: (settings: UserSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    
    // Check and generate cards for all selected courses
    const allCards = StorageService.getCards();
    let newCardsAccumulator: Card[] = [];
    let updated = false;

    // We look up names from the COURSES constant to generate readable mock data
    const availableCourses = Object.values(COURSES).flat();

    // Iterate over all selected courses
    settings.courses.forEach(courseId => {
        const hasCourseCards = allCards.some(c => c.courseId === courseId);
        // Only generate if no cards exist for this course
        if (!hasCourseCards) {
            const courseObj = availableCourses.find(c => c.id === courseId);
            const courseName = courseObj ? courseObj.name : courseId.toUpperCase();
            
            const generated = generateMockCards(courseId, courseName);
            newCardsAccumulator = [...newCardsAccumulator, ...generated];
            updated = true;
        }
    });

    if (updated) {
        StorageService.saveCards([...allCards, ...newCardsAccumulator]);
    }
  },

  getCards: (): Card[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CARDS);
    return data ? JSON.parse(data) : [];
  },

  saveCards: (cards: Card[]) => {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  },

  updateCard: (updatedCard: Card) => {
    const cards = StorageService.getCards();
    const index = cards.findIndex(c => c.id === updatedCard.id);
    if (index !== -1) {
      cards[index] = updatedCard;
      StorageService.saveCards(cards);
    }
  },

  addCard: (card: Card) => {
    const cards = StorageService.getCards();
    cards.push(card);
    StorageService.saveCards(cards);
  },

  getLogs: (): ReviewLog[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },

  logReview: (log: ReviewLog) => {
    const logs = StorageService.getLogs();
    logs.push(log);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  // Reset for debug
  clearAll: () => {
    localStorage.clear();
  }
};