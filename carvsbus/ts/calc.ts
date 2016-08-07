interface CarObject {
    Manufacturer: string;
    Model: string;
    Description: string;
    Transmission: string;
    EngineCapacity: number;
    FuelType: string;
    ElectricEnergyConsumptionMilesPkWh: string;
    whPkm: string;
    MaximumRangeKm: string;
    MaximumRangeMiles: string;
    MetricUrban: number;
    MetricExtraUrban: number;
    MetricCombined: number;
    ImperialUrban: number;
    ImperialExtraUrban: number;
    ImperialCombined: number;
    CO2_gPkm: number;
    FuelCost12000Miles: string;
    ElectricityCost: string;
    TotalCost12000Miles: string;
    EuroStandard: number;
    NoiseLeveldBA: number;
    EmissionsCO: number;
    THCEmissions: string;
    EmissionsNOx: number;
    THCNOxEmissions: number;
    Particulates: number;
}

interface PricesObject {
    price95: number;
    price100: number;
    priceSuper: number;
    priceDiesel: number;
    priceGas: number;
    monthlyCardPrice: number;
    monthlyCardPriceH: number;
}

var car_data: CarObject[];
var prices_data: PricesObject;

function carRequestListener() {
    var cars_raw: CarObject[] = JSON.parse(this.responseText);
    car_data = cars_raw;
    findCarManufacturers();
}

function carDataToArray() {
    var request = new XMLHttpRequest();
    request.onload = carRequestListener;
    request.open("get", "../data/all_car_fuel.json", true);
    request.send();
}

function pricesRequestListener() {
    var pricesObj: PricesObject = JSON.parse(this.responseText);
    prices_data = pricesObj;
    initValues();
}

function pricesDataToArray() {
    var request = new XMLHttpRequest();
    request.onload = pricesRequestListener;
    request.open("get", "../data/prices.json", true);
    request.send();
}

function calc2(fuel: number, distance: number, days: number, fuelPrice: number) {

    var result: number = distance * days * fuelPrice * fuel / 100;
    return result;
}

function calc() {
    //constants
    var price95: number = $('#inputPrice95').val();
    var price100: number = $('#inputPrice100').val();
    var priceSuper: number = $('#inputPriceSuper').val();
    var priceDiesel: number = $('#inputPriceDiesel').val();
    var priceGas: number = $('#inputPriceGas').val();
    var monthlyCardPrice: number = $('#inputPriceCard').val();
    var monthlyCardPriceL: number = $('#inputPriceCardHalf').val();
    //input
    var fuel: number = $('#inputLitre').val();
    var distance: number = $('#inputDistance').val();
    var days: number = $('#inputDays').val();
    var fuelType = $('#listFuelType').val();
    var isHlalfTicket: number = $('#listHalfTicket').val();

    var fuelPrice: number = 0;
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
    var cardPrice: number = isHlalfTicket == 1 ? monthlyCardPriceL : monthlyCardPrice;

    //calc
    var resultFuel: number = Math.round(calc2(fuel, distance, days, fuelPrice) * 100) / 100;
    //output
    $('#labelResult').text(resultFuel + " " + String.fromCharCode(8364));
    $('#labelCard').text(cardPrice + " " + String.fromCharCode(8364));
    $('#resultTextInfo').addClass('hidden');
    $('#resultTextCar').addClass('hidden');
    $('#resultTextBus').addClass('hidden');
    if (resultFuel <= cardPrice) {
        $('#resultTextCar').removeClass('hidden');
    } else {
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

function findCarManufacturers(): void {
    var manufacturers: string[] = [""];
    for (var i = 0; i < car_data.length; i++) {
        var element = car_data[i];
        if (manufacturers.indexOf(element.Manufacturer) == -1) {
            manufacturers.push(element.Manufacturer);
        }
    }
    populateManufacturers(manufacturers);
}

function findCarModels(manufacturer: string): CarObject[] {

    var models: CarObject[] = car_data.filter(function (car) {
        return car.Manufacturer === manufacturer;
    });
    populateModels(models);
    return models;
}

function findCarDescriptions(manufacturer: string, model: string): CarObject[] {

    var descriptions: CarObject[] = car_data.filter(function (car: CarObject) {
        return car.Manufacturer === manufacturer
            && car.Model === model;
    });
    return descriptions;
}

function findCar(manufacturer: string, model: string, description: string): CarObject {

    var car: CarObject = car_data.filter(function (car: CarObject) {
        return car.Manufacturer === manufacturer
            && car.Model === model
            && car.Description === description;
    })[0];
    return car;
}

function populateManufacturers(manufacturers: string[]) {
    manufacturers.sort(function compare(a: string, b: string) {
        if (a < b) {
            return -1;
        } else {
            return 1;
        }
    });
    var optionsCode: string = "";
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

function populateModels(models: CarObject[]) {
    models.sort(function compare(car1: CarObject, car2: CarObject) {
        if (car1.Model < car2.Model) {
            return -1;
        } else {
            return 1;
        }
    });
    var optionsCode: string = "";
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

function writeFuelConsumption(modelValue: string) {
    var splitValue: string[] = modelValue.split(";");
    var selectedCar: CarObject = findCar(
        $('#listCarManufacturer').val(),
        splitValue[0],
        splitValue[1]
    );
    $('#inputLitre').val(selectedCar.MetricUrban);
}

function writeFuelType(modelValue: string) {
    var splitValue: string[] = modelValue.split(";");
    var selectedCar: CarObject = findCar(
        $('#listCarManufacturer').val(),
        splitValue[0],
        splitValue[1]
    );
    var fuelType: string = selectedCar.FuelType;
    var value: number = 1;
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
    var value: string = $(this).val();
    findCarModels(value);
});

// on car select
$('#listCarModel').change(function () {
    var value: string = $(this).val();
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