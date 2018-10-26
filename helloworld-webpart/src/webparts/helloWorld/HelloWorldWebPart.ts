import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
} from '@microsoft/sp-webpart-base';
import { escape, fromPairs, constant } from '@microsoft/sp-lodash-subset';
import {SPHttpClient, SPHttpClientResponse,ISPHttpClientOptions}from '@microsoft/sp-http';
import styles from './HelloWorldWebPart.module.scss';
import * as strings from 'HelloWorldWebPartStrings';
import {SPComponentLoader}  from '@microsoft/sp-loader'

import * as jQuery from 'jquery';
require('bootstrap');

import{IHelloWorldWebPartProps} from './IHelloWorldWebPartProps';



export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  // public constructor(){
  //   super();
  //   SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");

  // }

  public render(): void {
    let cssdata = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    SPComponentLoader.loadCss(cssdata);
    this.domElement.innerHTML = `
      
    
    
        <div class="row">
          <div class="col-sm-12">
         
              <div id="myCarousel" class="carousel slide" data-ride="carousel">
                <!-- Indicators -->
                <ol class="carousel-indicators" id="carouselLI">
                 
                </ol>
            
                <!-- Wrapper for slides -->
                <div class="carousel-inner col-sm-12" id="Galary">
                <!-- Left and right controls -->
                </div>
                
            </div>
          </div>
        </div>
        <div class="row">
          <div class="modal fade" id="myModal" role="dialog">
              <div class="modal-dialog">
                  <!-- Modal content-->
                  <div class="modal-content" id="PopupContent">  

                  </div>
                
              </div>
          </div>
        </div>
   
        `;
    this.readyfun();
}
 
readyfun()  
{
  var Contxturl=this.context.pageContext.web.absoluteUrl;
  jQuery(document).ready(function(){
    $('#Galary').ready(ShowItems);
    

    function ShowItems() {
      var call = jQuery.ajax({
          url:Contxturl+"/_api/web/lists/getByTitle('Managers Speaks')/Items/?$select=ImageUrl,Subject,Description,ID",
          type: "GET",
          dataType: "json",
          headers: {
              Accept: "application/json;odata=verbose"
          }
      });
      var subject=$('#Subject'); 
      var images = $('#Galary');
      var LI=$('#carouselLI');
      var cnt=0;
      call.done(function (data, textStatus, jqXHR) {
          $.each(data.d.results, function (key, value) {
           if(cnt==0)
           {
            LI.append(`<li data-target="#myCarousel" data-slide-to="${key.toString()}" class="active"></li>`);
            images.append(`<div class="item active">

            <div class="panel-body center col-sm-8"> <img class="img-thumbnail" src="${value.ImageUrl}" style="width:100%"></div>
                 <div class="panel panel-default col-sm-3"  style="margin-top: 3%">
                    <div class="panel-body center">${value.Subject}</div>
                 </div>
                 <button type="button" class="btn btn-primary col-sm-3"  data-toggle="modal" data-target="#myModal" id="${value.ID}">Show More</button>
            </div>
                  <a class="left carousel-control" href="#myCarousel" data-slide="prev">
                  <span class="glyphicon glyphicon-chevron-left"></span>
                  <span class="sr-only">Previous</span>
                </a>
                <a class="right carousel-control" href="#myCarousel" data-slide="next">
                  <span class="glyphicon glyphicon-chevron-right"></span>
                  <span class="sr-only">Next</span>
                </a>
                  `);
                  cnt++;
           }
           else{
            LI.append(`<li data-target="#myCarousel" data-slide-to="${key.toString()}" class="active"></li>`);
            images.append(`<div class="item" >
            
            <div class="panel-body center col-sm-8"> <img class="img-thumbnail" src="${value.ImageUrl}" style="width:100%"></div>
              <div class="panel panel-default col-sm-3"  style="margin-top: 3%">
                <div class="panel-body center">${value.Subject}</div>
              </div>
              <button type="button" class="btn btn-primary col-sm-3" data-toggle="modal" data-target="#myModal" id="${value.ID}">Show More</button>
            </div>
            <a class="left carousel-control" href="#myCarousel" data-slide="prev">
            <span class="glyphicon glyphicon-chevron-left"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="right carousel-control" href="#myCarousel" data-slide="next">
            <span class="glyphicon glyphicon-chevron-right"></span>
            <span class="sr-only">Next</span>
          </a>
            `);
           }      
                 
            
          });
      });
      call.fail(function (jqXHR, textStatus, errorThrown) {
          var response = JSON.parse(jqXHR.responseText);
          var message = response ? response.error.message.value : textStatus;
          alert("Call failed. Error: " + message);
      });
      $(document).on("click", ".btn" , function() {

        GetPopup($(this).attr('id'));
     });

  }

  function GetPopup(id){
        var ItemID = id;
        $('#PopupContent').empty();
        var PopupDiv=$('#PopupContent');
        var call = jQuery.ajax({
            url: Contxturl+ "/_api/web/lists/getByTitle('Managers Speaks')/Items/?$select=ImageUrl,Subject,Description,ID&$filter=(ID eq '" + ItemID + "')",
            type: "GET",
            headers: {
                Accept: "application/json;odata=verbose"
            }
        });
        call.done(function (data, textStatus, jqXHR) {

            jQuery.each(data.d.results, function (index, value) {
               PopupDiv.append(`
             
                      <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                      </div>
                      <div class="modal-body col-sm-8">
                          <img src="${value.ImageUrl}" style="width:100%">
                      </div>
                      <div class="modal-body col-sm-4"> <div class="panel panel-default"><div class="panel-body center">${value.Subject}</div></div><div class="panel-body center">${value.Description}</div></div>
                     <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                     </div>
               `);

            });
        });
        call.fail(function (jqXHR, textStatus, errorThrown) {
            var response = JSON.parse(jqXHR.responseText);
            var message = response ? response.error.message.value : textStatus;
           
        });
      }

  

  });

}

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown('color', {
                  label: 'Dropdown',
                  options: [
                    { key: 'Red', text: 'Red'},
                    { key: 'Blue', text: 'Blue' },
                    { key: 'Green', text: 'Green' },
                  ],
              })
              ]
            }
          ]
        }
      ]
    };
  }
}
