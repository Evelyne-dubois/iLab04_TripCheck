// variable global
var start_date, end_date, jours, current_date, joursLeft, countdown; 
var travelName, travelBudget, currentBudget;
var errorDate;

var taches = [], foodAndDrinkTable = [], travelTable = [], accomodationsTable = [], activitiesTable = [], SouvenirTable = [], othersTable = [];


//Bloque le scroll on touch
// document.addEventListener('touchmove', function(event) {
//     event.preventDefault();
// }, false);

//Si le localStorage a des données > on affiche budget sinon > on affiche create trip
function localStorage_have_data(){

    if(localStorage.length == 0) {
        window.location.hash="create-trip";
    }else {
        window.location.hash="checklist-page";      
    }
}

// Verifie si les dates entrées sont cohérentes et calcule l'écart
function nbr_jours(){

    window.location.hash = "create-your-travel";

    // recupere les valeur du calendrier
    var start = document.getElementById("start");
    var end = document.getElementById("end");

    // Prepare la fenetre d'affichage
    var afficheur = document.getElementById("temps");

    // Store les date selectionné
    start_date = new Date(start.value);
    end_date = new Date(end.value);
    current_date = new Date();

    // calcule le nombre de jours
    jours = Math.ceil((end_date - start_date)/(1000*60*60*24)) + 1;


    // calcule si les dates donné ne sont pas déja passé
    var current_b_start = Math.ceil(start_date - current_date + 86400000);
    var current_b_end = Math.ceil(end_date - current_date + 86400000);

    // Vérifie si tout est ok et renvoie le resultat
    if(jours < 0 || current_b_start < 0 || current_b_end < 0 ){
        afficheur.innerHTML = 'dates are not correct.';
        errorDate = true;
        }else if(isNaN(jours)){
            afficheur.innerHTML = 0 + ' jour';
            errorDate = false;
            }else if( jours == 0 || jours == 1){
                afficheur.innerHTML = jours + ' jour';
                errorDate = false;
                }else {
                    afficheur.innerHTML = jours + ' jours';
                    errorDate = false;
                    }
}

// Verification du formulaire de création de voyage
function creat_travel(e){

    var error = document.getElementById("error");
    error.innerHTML = '';
    travelName = document.getElementById("travelName").value;
    travelBudget = document.getElementById("travelBudget").value;
   
   //Convertir en valeur numerique
    travelBudget = parseFloat(travelBudget);
    travelBudget = travelBudget.toFixed(2);

    // Vérifie si il y as des erreur
    if( travelName == ''){
        error.innerHTML += 'Please enter a travel name.</br>';
        document.getElementById("travelName").value = "";
    }
    if(errorDate == true || errorDate == null){
        error.innerHTML += 'dates are not correct.</br>';
        document.getElementById("start").value = "";
        document.getElementById("end").value = "";
    }
    if(isNaN(travelBudget) || travelBudget < 0){
        error.innerHTML += 'How much is your budget?</br>';
        document.getElementById("travelBudget").value = "";
    }else

    // Si pas d'erreur on sauvegarde en localStorage
    if(error.innerHTML == ''){
        save_travel();
        window.location.hash="checklist-page";

        //affiche sur la page budget
        // budget();
    }

    //Empeche le chargement de la page
    e.preventDefault();
    return false;
}

// Sauvegarde les données du formulaire en localStorage
 function save_travel(){
    
    localStorage["travelName"] = travelName;
    localStorage["travelStart"] = start_date;
    // Important, transforme corectement l'objet en string
    localStorage.setItem("travelEnd", JSON.stringify(end_date));
    localStorage["travelJours"] = jours;
    localStorage["travelBudget"] = travelBudget;
    localStorage["currentBudget"] = travelBudget;


    current_budget();
    days_left();
    budget_per_day();

    // affiche le budget sur la page lorsqu'on viens de créer le voyage
    // budget();
 }

// CHECKLIST
//modifie et sauvegarde le statue checked
function validate_check(index){
    taches[index].status = !taches[index].status;
    save_checklist();
}

//ajoute la valeur de l'input/text dans la liste
function add_checklist(e){
    window.location.hash="checklist-page";
    var addObject = document.getElementById("addObject").value;

    if(addObject != ''){
        taches.push( {
        label: addObject,
        status: false
        } );

        save_checklist();
        refresh_task_list();
        document.getElementById("addObject").value = "";
    }
    footer();
    e.preventDefault();
    return false;
}

// remet le footer en bas apres avoir valider un
function footer(){
    // var footer = document.getElementById("footer");

    var footer = document.getElementsByClassName('footer');

    // document.footer.style="position:absolute; left: 0; bottom: 0;";

    footer.style.position = 'absolute';
    footer.style.left = 0;
    footer.style.bottom = 0;

}

// save la liste(li) a chaque onChange(ul)
function save_checklist(){
    localStorage["tasks"] = JSON.stringify( taches );
}

function refresh_task_list() {
    var liste = '';

    for( var i=0;i<taches.length;i++) {
        liste += "<li><input type='checkbox' onClick='validate_check("+i+");' id='check_" + i +"'";
        if ( taches[i].status == true ) liste += " checked='checked'";
        liste += "/><label for='check_" + i + "'>" + taches[i].label + "</label></li>";
    }

    document.getElementById('checklist').innerHTML = liste;
}

//Retourne le localstorage à onLoad du body
function return_checklist(){
    if(localStorage.getItem("tasks") != null) {
        taches = JSON.parse( localStorage.getItem("tasks") );
    }else{
        taches = [];
    }
    refresh_task_list();
}

//Budget
// retourne le budget enregistrer
 function budget(){
    var budget = document.getElementById("budget");
    travelBudget = localStorage.getItem("travelBudget");
    budget.innerHTML = travelBudget + " budget max";
 }


// affiche le current budget
 function current_budget(){
    budgetleft = document.getElementById("budgetLeft");
    currentBudget = localStorage.getItem("currentBudget");
    budgetleft.innerHTML = currentBudget + '€';
 }

//Calcule combien de jours il reste
 function days_left(){

    travelBudget = localStorage.getItem("travelBudget");

    if(travelBudget != null){

        // jours restant avant la fin
        current_date = new Date();
        var start_date_saved = localStorage.getItem("travelStart");

        if(start_date_saved != null){
            start_date_saved = new Date(start_date_saved);
        }

        var daysLeft = document.getElementById("daysLeft");
        var countdownDaysLeft = document.getElementById("countdownDaysLeft");
        //verifie si le voyage a commencer
        var whatday = Math.ceil((start_date_saved - current_date)/(1000*60*60*24) + 1);

        //si le voyage a commencer
        if(whatday <= 1){ 

            var hidden = document.getElementById("countdown");
            hidden.classList.add("hidden");

            var show = document.getElementById("alldaysleft");
            show.classList.add("show");

            // recupere la date en string puis suprime la fin de la chaine
            var end_date_saved = localStorage.getItem("travelEnd");
            // var end_date2 = end_date_saved.substr(1,10);

            // redefini la date en Object (JSON.parse ne marche pas)
            if(end_date_saved != null){
                end_date_saved = new Date(end_date_saved.substr(1,10));
            }

            // Calcule l'écart entre maintenant et la fin du voyage
            joursLeft = Math.ceil((end_date_saved - current_date)/(1000*60*60*24) + 1);

            //affiche le nombre de jours restant
            // if(joursleft == 1){
            //     daysLeft.innerHTML = joursLeft + ' day';
            // }else{
                daysLeft.innerHTML = joursLeft + ' days';
            // }

            localStorage["daysLeft"] = joursLeft;
            countdown = false;

        }else {
            var hidden = document.getElementById("alldaysleft");
            hidden.classList.add("hidden");

            var show = document.getElementById("countdown");
            show.classList.add("show");
          
            var whatday2 = whatday - 1;

            // if(whatday2 == 1){
            //     countdownDaysLeft.innerHTML = whatday2 + ' day';
            // }else{
                countdownDaysLeft.innerHTML = whatday2 + ' days';
            // }

            countdown = true;
        }

        localStorage["countdown"] = countdown;
        budget_per_day();
    }
 }

// recalcule combien de jours il reste toute les 2h (si l'utulisateur garde l'app ouvert)
 setInterval(function(){

        days_left();

    }, 1000*60*60*2);
 // 1000*60*60*2

// Affiche le budget per day
function budget_per_day(){

    travelBudget = localStorage.getItem("travelBudget");
    var budgetPerDayLeft =  document.getElementById("budgetPerday");

    if(travelBudget != null){

       countdown =  localStorage.getItem("countdown");

       if(countdown == 'true'){

            budgetPerDayLeft.innerHTML = "";

       }else{
            joursLeft = localStorage.getItem("daysLeft");

            currentBudget = parseFloat(currentBudget);
            joursLeft = parseFloat(joursLeft);

            budgetPerDay = (currentBudget / joursLeft);
            budgetPerDay = budgetPerDay.toFixed(2);

            budgetPerDayLeft.innerHTML = budgetPerDay + "€/Days";
            localStorage["budgetPerDays"] = budgetPerDay;   
        }
    }
}


// under-cat
// ajoute un achat dans food and drink, la range dans un tableau, 
 function add_food_and_drink(e){

    currentBudget = localStorage.getItem("currentBudget")
    var addFoodBudget = document.getElementById("foodAnddrink").value;

    var errorFoofAndDrink = document.getElementById("errorFoofAndDrink");
    errorFoofAndDrink.innerHTML = '';

    if(isNaN(addFoodBudget) || addFoodBudget < 0){
        errorFoofAndDrink.innerHTML += 'Enter a positif number please.</br>';

    }else{

        //Calcule le nouveau current budget
        currentBudget = currentBudget - addFoodBudget
        currentBudget = currentBudget.toFixed(2);

        addFoodBudget = parseFloat(addFoodBudget);
        addFoodBudget = addFoodBudget.toFixed(2);

        //recupere la date du jour
        date = new Date();
        date = date.toString();

        daynumber = date.substr(8,2);
        month = date.substr(4,3);
        years = date.substr(11,4);
        hours = date.substr(16,5);

        foodAndDrinkTable.push( {
            label: addFoodBudget,
            date: daynumber + ' ' + month + ' ' + years + ' at ' + hours
        } );

        save_food_and_drink(); 
        refresh_food_and_drink_table(); 

        //Sauvegarde le current budget et le réaffiche
        localStorage["currentBudget"] = currentBudget; 
        current_budget(); 
        budget_per_day(); 
    }

    // footer();
    // window.location.hash="foodAnddrink-budget";
    // Remet le champ vide et annule le chargement de la page
    document.getElementById("foodAnddrink").value = "";
    e.preventDefault();
    return false;
 }

// Sauvegarde dans le localStorage
function save_food_and_drink(){

    localStorage["foodtable"] = JSON.stringify( foodAndDrinkTable );

}

// Affiche le tableau des depense
function refresh_food_and_drink_table(){

    var foodTable = "<tr><th>Date</th><th>Montants</th></tr>";

    for( var i=0;i<foodAndDrinkTable.length;i++) {
        foodTable += "<tr><td>" + foodAndDrinkTable[i].date + "</td>";
        foodTable += "<td>" + foodAndDrinkTable[i].label + "<span> €</span></td></tr>";
    }

    document.getElementById('foodAndDrinkTable').innerHTML = foodTable;

}

// réaffiche le tableau enregistrer au reload
function return_food_and_drink_table(){

    if(localStorage.getItem("foodtable") != null) {
        foodAndDrinkTable = JSON.parse( localStorage.getItem("foodtable") );
    }else{
        foodAndDrinkTable = [];
    }
    refresh_food_and_drink_table();
}

//TRAVEL
// ajoute un achat dans food and drink, la range dans un tableau, 
 function add_travel_cost(e){

    currentBudget = localStorage.getItem("currentBudget")
    var addTravelBudget = document.getElementById("travel").value;

    var errorTravelCost = document.getElementById("errorTravelCost");
    errorTravelCost.innerHTML = '';

    if(isNaN(addTravelBudget) || addTravelBudget < 0){
        errorTravelCost.innerHTML += 'Enter a positif number please.</br>';
    }else{
         //Calcule le nouveau current budget
        currentBudget = currentBudget - addTravelBudget
        currentBudget = currentBudget.toFixed(2);

        addTravelBudget = parseFloat(addTravelBudget);
        addTravelBudget = addTravelBudget.toFixed(2);

        //recupere la date du jour
        date = new Date();
        date = date.toString();

        daynumber = date.substr(8,2);
        month = date.substr(4,3);
        years = date.substr(11,4);
        hours = date.substr(16,5);

        travelTable.push( {
            label: addTravelBudget,
            date: daynumber + ' ' + month + ' ' + years + ' at ' + hours
        } );

        save_travel_cost(); 
        refresh_travel_cost_table(); 

        //Sauvegarde le current budget et le réaffiche
        localStorage["currentBudget"] = currentBudget; 
        current_budget(); 
        budget_per_day(); 
    }

    // Remet le champ vide et annule le chargement de la page
    document.getElementById("travel").value = "";
    e.preventDefault();
    return false;
 }

// Sauvegarde dans le localStorage
function save_travel_cost(){

    localStorage["traveltable"] = JSON.stringify( travelTable );

}

// Affiche le tableau des depense
function refresh_travel_cost_table(){

    var displayTravelTable = "<tr><th>Date</th><th>Montants</th></tr>";

    for( var i=0;i<travelTable.length;i++) {
        displayTravelTable += "<tr><td>" + travelTable[i].date + "</td>";
        displayTravelTable += "<td>" + travelTable[i].label + "<span> €</span></td></tr>";
    }

    document.getElementById('travelTable').innerHTML = displayTravelTable;

}

// réaffiche le tableau enregistrer au reload
function return_travel_table(){

    if(localStorage.getItem("traveltable") != null) {
        travelTable = JSON.parse( localStorage.getItem("traveltable") );
    }else{
        travelTable = [];
    }
    refresh_travel_cost_table();
}

//Accomodations
// ajoute un achat dans food and drink, la range dans un tableau, 
 function add_accomodations_cost(e){

    currentBudget = localStorage.getItem("currentBudget")
    var addAccomodationsBudget = document.getElementById("Accomodations").value;

    var errorAccomodationsCost = document.getElementById("errorAccomodationsCost");
    errorAccomodationsCost.innerHTML = '';

    if(isNaN(addAccomodationsBudget) || addAccomodationsBudget < 0){
        errorAccomodationsCost.innerHTML += 'Enter a positif number please.</br>';
    }else{
         //Calcule le nouveau current budget
        currentBudget = currentBudget - addAccomodationsBudget;
        currentBudget = currentBudget.toFixed(2);

        addAccomodationsBudget = parseFloat(addAccomodationsBudget);
        addAccomodationsBudget = addAccomodationsBudget.toFixed(2);

        //recupere la date du jour
        date = new Date();
        date = date.toString();

        daynumber = date.substr(8,2);
        month = date.substr(4,3);
        years = date.substr(11,4);
        hours = date.substr(16,5);

        accomodationsTable.push( {
            label: addAccomodationsBudget,
            date: daynumber + ' ' + month + ' ' + years + ' at ' + hours
        } );

        save_accomodations_cost(); 
        refresh_accomodations_cost_table(); 

        //Sauvegarde le current budget et le réaffiche
        localStorage["currentBudget"] = currentBudget; 
        current_budget(); 
        budget_per_day(); 
    }

    // Remet le champ vide et annule le chargement de la page
    document.getElementById("Accomodations").value = "";
    e.preventDefault();
    return false;
 }

// Sauvegarde dans le localStorage
function save_accomodations_cost(){

    localStorage["accomodationstable"] = JSON.stringify( accomodationsTable );

}

// Affiche le tableau des depense
function refresh_accomodations_cost_table(){

    var displayAccomodationsTable = "<tr><th>Date</th><th>Montants</th></tr>";

    for( var i=0;i<accomodationsTable.length;i++) {
       displayAccomodationsTable += "<tr><td>" + accomodationsTable[i].date + "</td>";
        displayAccomodationsTable += "<td>" + accomodationsTable[i].label + "<span> €</span></td></tr>";
    }

    document.getElementById('accomodationstable').innerHTML = displayAccomodationsTable;

}

// réaffiche le tableau enregistrer au reload
function return_accomodations_table(){

    if(localStorage.getItem("accomodationstable") != null) {
        accomodationsTable = JSON.parse( localStorage.getItem("accomodationstable") );
    }else{
        accomodationsTable = [];
    }
    refresh_accomodations_cost_table();
}

//ACTIVITIES
// ajoute un achat dans food and drink, la range dans un tableau, 
 function add_activities_cost(e){

    currentBudget = localStorage.getItem("currentBudget")
    var addActivitiesBudget = document.getElementById("activities").value;

    var errorActivitiesCost = document.getElementById("errorActivitiesCost");
    errorActivitiesCost.innerHTML = '';

    if(isNaN(addActivitiesBudget) || addActivitiesBudget < 0){
        errorActivitiesCost.innerHTML += 'Enter a positif number please.</br>';
    }else{
         //Calcule le nouveau current budget
        currentBudget = currentBudget - addActivitiesBudget;
        currentBudget = currentBudget.toFixed(2);

        addActivitiesBudget = parseFloat(addActivitiesBudget);
        addActivitiesBudget = addActivitiesBudget.toFixed(2);

        //recupere la date du jour
        date = new Date();
        date = date.toString();

        daynumber = date.substr(8,2);
        month = date.substr(4,3);
        years = date.substr(11,4);
        hours = date.substr(16,5);

        activitiesTable.push( {
            label: addActivitiesBudget,
            date: daynumber + ' ' + month + ' ' + years + ' at ' + hours
        } );

        save_activities_cost(); 
        refresh_activities_cost_table(); 

        //Sauvegarde le current budget et le réaffiche
        localStorage["currentBudget"] = currentBudget; 
        current_budget(); 
        budget_per_day(); 
    }

    // Remet le champ vide et annule le chargement de la page
    document.getElementById("activities").value = "";
    e.preventDefault();
    return false;
 }

// Sauvegarde dans le localStorage
function save_activities_cost(){

    localStorage["activitiesTable"] = JSON.stringify( activitiesTable );

}

// Affiche le tableau des depense
function refresh_activities_cost_table(){

    var displayActivitiesTable = "<tr><th>Date</th><th>Montants</th></tr>";

    for( var i=0;i<activitiesTable.length;i++) {
        displayActivitiesTable += "<tr><td>" + activitiesTable[i].date + "</td>";
        displayActivitiesTable += "<td>" + activitiesTable[i].label + "<span> €</span></td></tr>";
    }

    document.getElementById('activitiesTable').innerHTML = displayActivitiesTable;

}

// réaffiche le tableau enregistrer au reload
function return_activities_table(){

    if(localStorage.getItem("activitiesTable") != null) {
        activitiesTable = JSON.parse( localStorage.getItem("activitiesTable") );
    }else{
        activitiesTable = [];
    }
    refresh_activities_cost_table();
}

//souvenirs
// ajoute un achat dans food and drink, la range dans un tableau, 
 function add_souvenirs_cost(e){

    currentBudget = localStorage.getItem("currentBudget")
    var addSouvenirsBudget = document.getElementById("souvenirs").value;

    var errorSouvenirsCost = document.getElementById("errorSouvenirsCost");
    errorSouvenirsCost.innerHTML = '';

    if(isNaN(addSouvenirsBudget) || addSouvenirsBudget < 0){
        errorSouvenirsCost.innerHTML += 'Enter a positif number please.</br>';
    }else{
         //Calcule le nouveau current budget
        currentBudget = currentBudget - addSouvenirsBudget;
        currentBudget = currentBudget.toFixed(2);

        addSouvenirsBudget = parseFloat(addSouvenirsBudget);
        addSouvenirsBudget = addSouvenirsBudget.toFixed(2);

        //recupere la date du jour
        date = new Date();
        date = date.toString();

        daynumber = date.substr(8,2);
        month = date.substr(4,3);
        years = date.substr(11,4);
        hours = date.substr(16,5);

        SouvenirTable.push( {
            label: addSouvenirsBudget,
            date: daynumber + ' ' + month + ' ' + years + ' at ' + hours
        } );

        save_souvenir_cost(); 
        refresh_souvenir_cost_table(); 

        //Sauvegarde le current budget et le réaffiche
        localStorage["currentBudget"] = currentBudget; 
        current_budget(); 
        budget_per_day(); 
    }

    // Remet le champ vide et annule le chargement de la page
    document.getElementById("souvenirs").value = "";
    e.preventDefault();
    return false;
 }

// Sauvegarde dans le localStorage
function save_souvenir_cost(){

    localStorage["SouvenirTable"] = JSON.stringify( SouvenirTable );

}

// Affiche le tableau des depense
function refresh_souvenir_cost_table(){

    var displaySouvenirTable = "<tr><th>Date</th><th>Montants</th></tr>";

    for( var i=0;i<SouvenirTable.length;i++) {
        displaySouvenirTable += "<tr><td>" + SouvenirTable[i].date + "</td>";
        displaySouvenirTable += "<td>" + SouvenirTable[i].label + "<span> €</span></td></tr>";
    }

    document.getElementById('SouvenirTable').innerHTML = displaySouvenirTable;

}

// réaffiche le tableau enregistrer au reload
function return_souvenir_table(){

    if(localStorage.getItem("SouvenirTable") != null) {
        SouvenirTable = JSON.parse( localStorage.getItem("SouvenirTable") );
    }else{
        SouvenirTable = [];
    }
    refresh_souvenir_cost_table();
}

//OTHERS
// ajoute un achat dans food and drink, la range dans un tableau, 
 function add_others_cost(e){

    currentBudget = localStorage.getItem("currentBudget")
    var addOthersBudget = document.getElementById("others").value;

    var errorOthersCost = document.getElementById("errorOthersCost");
    errorOthersCost.innerHTML = '';

    if(isNaN(addOthersBudget) || addOthersBudget < 0){
        errorOthersCost.innerHTML += 'Enter a positif number please.</br>';
    }else{
         //Calcule le nouveau current budget
        currentBudget = currentBudget - addOthersBudget;
        currentBudget = currentBudget.toFixed(2);

        addOthersBudget = parseFloat(addOthersBudget);
        addOthersBudget = addOthersBudget.toFixed(2);

        //recupere la date du jour
        date = new Date();
        date = date.toString();

        daynumber = date.substr(8,2);
        month = date.substr(4,3);
        years = date.substr(11,4);
        hours = date.substr(16,5);

        othersTable.push( {
            label: addOthersBudget,
            date: daynumber + ' ' + month + ' ' + years + ' at ' + hours
        } );

        save_others_cost(); 
        refresh_others_cost_table(); 

        //Sauvegarde le current budget et le réaffiche
        localStorage["currentBudget"] = currentBudget; 
        current_budget(); 
        budget_per_day(); 
    }

    // Remet le champ vide et annule le chargement de la page
    document.getElementById("others").value = "";
    e.preventDefault();
    return false;
 }

// Sauvegarde dans le localStorage
function save_others_cost(){

    localStorage["othersTable"] = JSON.stringify( othersTable );

}

// Affiche le tableau des depense
function refresh_others_cost_table(){

    var displayOthersTable = "<tr><th>Date</th><th>Montants</th></tr>";

    for( var i=0;i<othersTable.length;i++) {
        displayOthersTable += "<tr><td>" + othersTable[i].date + "</td>";
        displayOthersTable += "<td>" + othersTable[i].label + "<span> €</span></td></tr>";
    }

    document.getElementById('othersTable').innerHTML = displayOthersTable;

}

// réaffiche le tableau enregistrer au reload
function return_others_table(){

    if(localStorage.getItem("othersTable") != null) {
        othersTable = JSON.parse( localStorage.getItem("othersTable") );
    }else{
        othersTable = [];
    }
    refresh_others_cost_table();
}

//Archiver
function archiver(){
    if (confirm("Do you really want to archive?\nCurrently we are not able to save it, you'll lost all your data.")) {
    localStorage.clear();
    }
}

// Renvoie toute les données au reload
 function return_storage(){

    // Check si le localStorage est vide ou non et affiche la bonne page
    localStorage_have_data();

    //Checklist
    // Affiche la checklist au reload de la page
    return_checklist();

    // affiche le budget sur la page au reload de la page
    // budget();

    // Budget
    // affiche le current budget sur la page au reload de la page
    current_budget();

    // affiche les jours restant sur la page au reload de la page
    days_left();

    // affiche le current budget sur la page au reload de la page
    budget_per_day();

    //Under-Cat
    // Affiche les tableaux
    return_food_and_drink_table();
    return_travel_table();
    return_accomodations_table();
    return_activities_table();
    return_souvenir_table();
    return_others_table();
}
  

