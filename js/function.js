window.onload = function(){
  document.getElementById("update").style.visibility = "hidden";
  displaystates();
  userdata();
  document.getElementById("reset").onclick=onreset;        
  $("form").submit(function(e){
    e.preventDefault();
    insertData();
  });
}

function onreset()
{
	document.getElementById("update").style.visibility = "hidden";
	document.getElementById("submit").style.visibility = "visible";
	document.getElementById("name").value="";
	document.getElementById("mobile").value="";
	document.getElementById("address").value="";
  //document.getElementById("p1").value="";
  //document.getElementById("p2").value="";
  console.log(document.getElementById("p3").innerText);
  document.getElementById("p3").innerText = "";
	document.getElementById("state").value="-1";
	document.getElementById("city-data").style.visibility = "hidden";
	//document.getElementById("gender").value="";
}   


function onselectstate1(){
   document.getElementById("city-data").style.visibility = "visible";
   var myData1={};
   var option = document.getElementById("state");
   var my = option.options[option.selectedIndex];

   myData1._id = my.getAttribute("sid");
   postRequest("http://localhost:3005/citydata",myData1,function(status,resp){
    if(status == 200){
      try{
        var respObj2 = JSON.parse(resp);
        var list2="<select class=\"form-control\" Name=\"city\"  id=\"city\">";
        for(var i = 0; i < respObj2.length; i++){
            list2+="<option value=\""+respObj2[i].name+"\">"+respObj2[i].name+"</option>";
        }
        list2+="</select >";
        document.getElementById("city-data").innerHTML = list2;  
      }
      catch(e){
        document.getElementById('p3').innerText = e;
      }
    }  
    else{
      document.getElementById('p3').innerText = "something went wrong";            
  }
  });
}

function displaystates(){
  getRequest("http://localhost:3005/states",function(status,resp){
    if(status == 200){
      try{
        var respObj1 = JSON.parse(resp);
        var list="<select class=\"form-control\" Name=\"state\" id=\"state\" required >";
        list +="<option value=\"-1\">Select-State</option>";
        for(var i = 0; i < respObj1.length; i++){
          list+="<option sid=\""+respObj1[i]._id+"\" value = \""+respObj1[i].name+"\">"+respObj1[i].name+"</option>";
        }
        list+="</select>";
        document.getElementById("states-data").innerHTML = list;
        var option = document.getElementById("state");            
        for(var i = 0; i < respObj1.length; i++){                            
         document.getElementById("state").onchange=onselectstate1;
        }
      }
      catch(e){
        document.getElementById('p3').innerText = e;
      }           
    }  
  else{
      document.getElementById('p3').innerText = "something went wrong";            
  }
  });
}
 
function insertData(){
   var myData = formValidation();
   if(myData){
    console.log(myData);
    postRequest("http://localhost:3005/insert",myData,function(status,responseText){
      if(status==200){
        try{
          data = JSON.parse(responseText);
          //document.getElementById('p3').innerText = "";
          addRowToTable(myData,data)
        }
        catch(e){
          document.getElementById('p3').innerText = e;
        }
      }else{
        document.getElementById('p3').innerText = "something went wrong";
      }
    });

   }
   
}


function formValidation(){
  var name = document.getElementById('name').value;
  var mobile = document.getElementById('mobile').value;
  var address = document.getElementById("address").value;
  var state = document.getElementById("state").value;
  var city = document.getElementById("city")? document.getElementById("city").value : -1;
  var myData = {};
  if(inputAlphabet(name)){
    myData.name = name;
  }else{
    document.getElementById("p3").innerText = "* For your name please use alphabets only *";
    return false;
  }

  if(inputNumber(mobile)){
    myData.mobile = mobile;
  }else{
    document.getElementById("p3").innerText = "* For your mobile please use numbers only *";
    return false;
  }

  if(inputAddress(address)){
    myData.address = address;
  }else{
    document.getElementById("p3").innerText = "* please enter Address *";
    return false;
  }

  if(inputSelect(state)){
    myData.state = state;
  }  
  else {
    document.getElementById("p3").innerText = "* please select state *";
    return false;
  }
  

  if(inputSelect(city)){
    myData.city = city;
  }
  else{
    document.getElementById("p3").innerText = "* please select city *";
    return false;
  }
  
  if(document.getElementById("female").checked) myData.gender = document.getElementById("female").value;
  else myData.gender = document.getElementById("male").value;
  return myData;
	
	
}				

function onDeleteClick(self){
  console.log('delete called');
  console.log(self);
  
  var myData1={};
  console.log(myData1);
  var tab = document.getElementById("table");
  myData1._id = self.getAttribute("oid");
  //tab.deleteRow(this.parentNode.parentNode.rowIndex); 
  postRequest("http://localhost:3005/delete",myData1,function(status,resp){
    if(status == 200){
      
       tab.deleteRow(self.parentNode.parentNode.rowIndex);
       //console.log(my); 
       console.log("row deleted");           
    }
    else{
      document.getElementById('p3').innerText = "something went wrong";
    }
  });
} 

function addRowToTable(myData,data){
  var tabb = document.getElementById("table");
  var len = (tabb.rows.length);
  var row = tabb.insertRow(len).outerHTML='<tr>\
  <td><button oid="'+ data.id +'" type="button" class="delete-btn" >Delete</td>\
  <td><button oid="'+ data.id + '"type="button" class="update-btn">Update</td>\
  <td>'+myData.name+'</td>\
  <td>'+myData.mobile+'</td>\
  <td>'+myData.address+'</td>\
  <td>'+myData.state+'</td>\
  <td>'+myData.city+'</td>\
  <td>'+myData.gender+'</td>\
  <tr>';
  var newElements=document.querySelectorAll("[oid=\""+data.id+"\"]");
  $('.delete-btn').click(function() {
    console.log(".delete-btn");

    onDeleteClick(this);
  });
  $('.update-btn').click(function() {
    //console.log(".update-btn");
    onUpdateClick(this);
  });
  onreset();
}

function userdata(){
  getRequest("http://localhost:3005/users",function(status,resp){
    if(status == 200){
      try{
        var respObj = JSON.parse(resp);
        var table = "<table id=\"table\" style=\"width:100%\" , \"border: 1px solid black\"> \
        <tr> \
          <th>Delete</th>\
          <th>Update</th>\
          <th>Name</th> \
          <th>Mobile</th> \
            <th>Address</th>\
            <th>State</th> \
            <th>City</th> \
            <th>Gender</th> \
        </tr>";    
        for(var i = 0; i < respObj.length; i++){
          table += '<tr> \
          <td> <button oid="' + respObj[i]._id + '" class="delete-btn" type="button">Delete</button></td>\
          <td> <button oid="' + respObj[i]._id + '" class="update-btn" id="update" type="button">Update</button></td>\
          <td>'+ respObj[i].name +'</td> \
          <td>'+ respObj[i].mobile +'</td> \
          <td>'+ respObj[i].address +'</td> \
          <td>'+ respObj[i].state +'</td>\
          <td>'+ respObj[i].city +'</td> \
          <td>'+ respObj[i].gender +'</td> \
          </tr>';
        }
        table += "</table>";
        document.getElementById("user-data").innerHTML = table;
        //var newElements=document.querySelectorAll("[oid=\""+data.id+"\"]");
         $('.delete-btn').click(function() {
          console.log("this",this);
          onDeleteClick(this);
        });
        $('.update-btn').click(function() {
          onUpdateClick(this);
        });              
      }
      catch(e){
        document.getElementById('p3').innerText = e;
      }           
    }  
    else{
      document.getElementById('p3').innerText = "something went wrong";            
    }
  }); 
}

function onUpdateClick(self){
  document.getElementById("update").style.visibility = "visible";
  document.getElementById("submit").style.visibility = "hidden"; 
  //console.log("ids",this.getAttribute("oid"));
  var ids = self.getAttribute("oid");
  console.log("ids",ids);
  var table=document.getElementById("table"); 
  var row = self.parentElement.parentElement;
  var changes = row;
    console.log("this", this);  
  document.getElementById("name").value = row.cells[2].innerText;
  document.getElementById("mobile").value = row.cells[3].innerText;
  document.getElementById("address").value = row.cells[4].innerText;
  document.getElementById("state").value = row.cells[5].innerText;
  //document.getElementById("city").value=this.cells[6].innerText;
  if(document.getElementById("state").value=="maharashtra")
  {
    var list2="<select class=\"form-control\" Name=\"city\"  id=\"city\">\
      <option value=\"mumbai\">mumbai</option>\
      <option value=\"pune\">pune</option>\
      <option value=\"nashik\">nashik</option>\
    </select>";
    document.getElementById("city-data").style.visibility = "visible";
    document.getElementById("city-data").innerHTML = list2;
    document.getElementById("city").value=row.cells[6].innerText;
  }
  else if(document.getElementById("state").value=="uttar prasdesh")
  {
    var list2="<select class=\"form-control\" Name=\"city\"  id=\"city\">\
      <option value=\"Agra\">Agra</option>\
      <option value=\"Allahabad\">Allahabad</option>\
      <option value=\"Azamgarh\">Azamgarh</option>\
    </select>";
    document.getElementById("city-data").style.visibility = "visible";
    document.getElementById("city-data").innerHTML = list2;
    document.getElementById("city").value=row.cells[6].innerText;
  }
  else if(document.getElementById("state").value=="kerela")
  {
    var list2="<select class=\"form-control\" Name=\"city\"  id=\"city\">\
      <option value=\"Kochi\">Kochi</option>\
      <option value=\"Kovalam\">Kovalam</option>\
      <option value=\"Munnar\">Munnar</option>\
    </select>";
    document.getElementById("city-data").style.visibility = "visible";
    document.getElementById("city-data").innerHTML = list2;
    document.getElementById("city").value=row.cells[6].innerText;
  }
  else if(document.getElementById("state").value=="gujarat")
  {
    var list2="<select class=\"form-control\" Name=\"city\"  id=\"city\">\
      <option value=\"surat\">surat</option>\
      <option value=\"Ahmedabad\">Ahmedabad</option>\
      <option value=\"rajkot\">rajkot</option>\
    </select>";
    document.getElementById("city-data").style.visibility = "visible";
    document.getElementById("city-data").innerHTML = list2;
    document.getElementById("city").value=row.cells[6].innerText;
  }  
  if(row.cells[7].innerText=="Female")
  {
    document.getElementById("female").checked=true;
    document.getElementById("male").checked=false;
  }
  else
  {
    document.getElementById("male").checked=true;
    document.getElementById("female").checked=false;
  }
  document.getElementById("update").onclick = function(){
    console.log("clicked");
    var myData = formValidation();
    myData._id=ids;
    console.log("myData1",myData);
  if(myData){
    postRequest("http://localhost:3005/update",myData,function(status,responseText){
    if(status==200){
      try{
        console.log(responseText);
        var myData1 = JSON.parse(responseText);
        //console.log("myData1",myData1);
        //document.getElementById('p3').innerText  = "";
        changes.cells[2].innerText=myData1.name;
        changes.cells[3].innerText=myData1.mobile;
        changes.cells[4].innerText=myData1.address;
        changes.cells[5].innerText=myData1.state;
        changes.cells[6].innerText=myData1.city;
        changes.cells[7].innerText=myData1.gender;
        onreset();
        //document.getElementById("p3").value="";
        document.getElementById("city-data").style.visibility = "hidden";
        document.getElementById("submit").style.visibility = "visible";
        document.getElementById("update").style.visibility = "hidden";
        
      }
      catch(e){
        document.getElementById('p3').innerText = e;
      }
    }else{
      document.getElementById('p3').innerText = "something went wrong";
    }
  });

  }
  
  
  } 

}