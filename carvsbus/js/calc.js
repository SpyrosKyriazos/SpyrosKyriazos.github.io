var car_data;
var prices_data;
function carRequestListener() {
    var cars_raw = JSON.parse(this.responseText);
    car_data = cars_raw;
    findCarManufacturers();
}
function carDataToArray() {
    var request = new XMLHttpRequest();
    request.onload = carRequestListener;
    request.open("get", "data/all_car_fuel.json", true);
    request.send();
}
function pricesRequestListener() {
    var pricesObj = JSON.parse(this.responseText);
    prices_data = pricesObj;
    initValues();
}
function pricesDataToArray() {
    var request = new XMLHttpRequest();
    request.onload = pricesRequestListener;
    request.open("get", "data/prices.json", true);
    request.send();
}
function calc2(fuel, distance, days, fuelPrice) {
    var result = distance * days * fuelPrice * fuel / 100;
    return result;
}
function calc() {
    //constants
    var price95 = $('#inputPrice95').val();
    var price100 = $('#inputPrice100').val();
    var priceSuper = $('#inputPriceSuper').val();
    var priceDiesel = $('#inputPriceDiesel').val();
    var priceGas = $('#inputPriceGas').val();
    var monthlyCardPrice = $('#inputPriceCard').val();
    var monthlyCardPriceL = $('#inputPriceCardHalf').val();
    //input
    var fuel = $('#inputLitre').val();
    var distance = $('#inputDistance').val();
    var days = $('#inputDays').val();
    var fuelType = $('#listFuelType').val();
    var isHlalfTicket = $('#listHalfTicket').val();
    var fuelPrice = 0;
    switch (fuelType) {
        case "1":
            fuelPrice = price95;
            break;
        case "2":
            fuelPrice = price100;
            break;
        case "3":
            fuelPrice = priceSuper;
            break;
        case "4":
            fuelPrice = priceDiesel;
            break;
        case "5":
            fuelPrice = priceGas;
            break;
        default:
            fuelPrice = price95;
    }
    var cardPrice = isHlalfTicket == 1 ? monthlyCardPriceL : monthlyCardPrice;
    //calc
    var resultFuel = Math.round(calc2(fuel, distance, days, fuelPrice) * 100) / 100;
    //output
    $('#labelResult').text(resultFuel + " " + String.fromCharCode(8364));
    $('#labelCard').text(cardPrice + " " + String.fromCharCode(8364));
    $('#resultTextInfo').addClass('hidden');
    $('#resultTextCar').addClass('hidden');
    $('#resultTextBus').addClass('hidden');
    if (resultFuel <= cardPrice) {
        $('#resultTextCar').removeClass('hidden');
    }
    else {
        $('#resultTextBus').removeClass('hidden');
    }
    scrollAnimate($('#buttonCalculate'));
}
function initValues() {
    //constants
    $('#inputPrice95').val(prices_data.price95);
    $('#inputPrice100').val(prices_data.price100);
    $('#inputPriceSuper').val(prices_data.priceSuper);
    $('#inputPriceDiesel').val(prices_data.priceDiesel);
    $('#inputPriceGas').val(prices_data.priceGas);
    $('#inputPriceCard').val(prices_data.monthlyCardPrice);
    $('#inputPriceCardHalf').val(prices_data.monthlyCardPriceH);
}
function findCarManufacturers() {
    var manufacturers = [""];
    for (var i = 0; i < car_data.length; i++) {
        var element = car_data[i];
        if (manufacturers.indexOf(element.Manufacturer) == -1) {
            manufacturers.push(element.Manufacturer);
        }
    }
    populateManufacturers(manufacturers);
}
function findCarModels(manufacturer) {
    var models = car_data.filter(function (car) {
        return car.Manufacturer === manufacturer;
    });
    populateModels(models);
    return models;
}
function findCarDescriptions(manufacturer, model) {
    var descriptions = car_data.filter(function (car) {
        return car.Manufacturer === manufacturer
            && car.Model === model;
    });
    return descriptions;
}
function findCar(manufacturer, model, description) {
    var car = car_data.filter(function (car) {
        return car.Manufacturer === manufacturer
            && car.Model === model
            && car.Description === description;
    })[0];
    return car;
}
function populateManufacturers(manufacturers) {
    manufacturers.sort(function compare(a, b) {
        if (a < b) {
            return -1;
        }
        else {
            return 1;
        }
    });
    var optionsCode = "";
    for (var i = 0; i < manufacturers.length; i++) {
        var element = manufacturers[i];
        optionsCode += "<option value=\"";
        optionsCode += element;
        optionsCode += "\">";
        optionsCode += element;
        optionsCode += "</option>";
    }
    $('#listCarManufacturer').append(optionsCode);
}
function populateModels(models) {
    models.sort(function compare(car1, car2) {
        if (car1.Model < car2.Model) {
            return -1;
        }
        else {
            return 1;
        }
    });
    var optionsCode = "";
    for (var i = 0; i < models.length; i++) {
        var element = models[i];
        optionsCode += "<option value=\"";
        optionsCode += element.Model + ";" + element.Description;
        optionsCode += "\">";
        optionsCode += element.Model + " " + element.Description;
        optionsCode += "</option>";
    }
    $('#listCarModel').children('option').remove();
    $('#listCarModel').append(optionsCode);
}
function writeFuelConsumption(modelValue) {
    var splitValue = modelValue.split(";");
    var selectedCar = findCar($('#listCarManufacturer').val(), splitValue[0], splitValue[1]);
    $('#inputLitre').val(selectedCar.MetricUrban);
}
function writeFuelType(modelValue) {
    var splitValue = modelValue.split(";");
    var selectedCar = findCar($('#listCarManufacturer').val(), splitValue[0], splitValue[1]);
    var fuelType = selectedCar.FuelType;
    var value = 1;
    if (fuelType.indexOf('Diesel') !== -1) {
        value = 4;
    }
    $('#listFuelType').val(value);
}
function scrollAnimateHref($anchor) {
    $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top - 120)
    }, 1200, 'swing');
}
function scrollAnimate($anchor) {
    $('html, body').stop().animate({
        scrollTop: ($($anchor).offset().top - 50)
    }, 1200, 'swing');
}
// calculate button listener
$(function () {
    $('#buttonCalculate').bind('click', function (event) {
        calc();
    });
});
// on manufacturer select
$('#listCarManufacturer').change(function () {
    var value = $(this).val();
    findCarModels(value);
});
// on car select
$('#listCarModel').change(function () {
    var value = $(this).val();
    writeFuelConsumption(value);
    writeFuelType(value);
});
//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
    $('.page-scroll a').bind('click', function (event) {
        var $anchor = $(this);
        $('.page-scroll.active').removeClass('active');
        $(this).parent().addClass('active');
        scrollAnimateHref($anchor);
        event.preventDefault();
    });
});
pricesDataToArray();
carDataToArray();
//# sourceMappingURL=calc.js.map