declare module CreateTechnicalSheets {

    export interface Product {
        customerName: string;
        lineId: number;
        subLineId: number;
        qualityId: number;
        productId: string;
        sourceProductId: string;
        technicalProductId: string;
        barCode: string;
        productName: string;
        widthId: number;
        numberOfColors: number;
        numberOfAdhesives: number;
        numberOfAccessories: number;
        numberOfPapers: number;
        numberOfColorants: number;
        numberOfAuxiliaries: number;
        numberOfReductive: number;
        commercialLenght: number;
        productionLenght: number;
        warpId: string;
        shapeTypeId: string;
        sizes: string;
        cutId: number;
        adhesiveId: number;
        finishId: number;
        unitMeasureId: string;
        salesUnit: string;
        purchaseUnit: string;
        linealUnit: string;
        storageUnit: string;
        sequenceType: string;
        onlyUsedByCustomer: string;
        abcClassification: string;
        origin: string;
        customerId: number;
        approvedDate: string;
        drawedBy: number;
        drawedDate: string;
        designerId: number;
        designedDate: string;
        graphicFile: string;
        fileType: string;
        rewindingId: number;
        packUnit: string;
        packQuantity: number;
        isCustomerProperty: string;
        locationUpdateDate: string;
        isKit: string;
        isServices: string;
        isFixedAsset: string;
        inspectionMethodId: number;
        inspectionQuantity: number;
        baseQuantityWeight: number;
        weight: number;
        weightUnit: string;
        inventoryStatusId: number;
        applicationId: number;
        palleteTypeId: number;
        standardProduction: number;
        locationDesignId: number;
        detailedConceptApId: number;
        packagingReferenceId: number;
    }

    export interface Sample {
        companyId: number;
        sampleId: number;
        formNumber: number;
        purchaseNumber: string;
        plantId: number;
        customerId: number;
        storeHouseId: number;
        productId: string;
        sampleQuantity: number;
        sampleEncodedImage: string;
        placementDate: Date;
        requestDate: Date;
        sampleModifiedDate: Date;
        sampleApprovalTypeId: number;
        samplePendingToPrint: string;
        samplesNotes: string;
        fulfilledBy: string;
    }

    export interface CustomerReference {
        dataBaseContextUuid: string;
        businessId: number;
        language: string;
        customerId: number;
        productId: string;
        referenceId: string;
        referenceName: string;
        referenceColor: string;
        sku1: string;
    }

    export interface BillOfMaterial {
        dataBaseContextUuid: string;
        businessId: number;
        language: string;
        productId: string;
        materialPositionId: string;
        materialId: string;
        description: string;
        picksByColor: number;
        runByColor: number;
        transferSpecialtyId: number;
        printout: string;
        border: string;
        baseSource: string;
        standarQuantity: number;
        realQuantity: number;
        unitMeasureId: string;
        standarFormula: string;
        quantityStandarFormula: number;
    }

    export interface BillOfMaterialFlexo {
        dataBaseContextUuid: string;
        businessId: number;
        language: string;
        productId: string;
        stationNumber: number;
        materialPositionId: string;
        description: string;
        squareMillimeterArea: number;
        aniloxRollId: number;
        uv: string;
        water: string;
        bcm: number;
        stickyBack: number;
        deltaE: number;
        minimumDensityPercentage: number;
        maximumDensityPercentage: number;
        registerStatusId: number;
        createdByUser: string;
        creationDate: Date;
        modifiedByUser: string;
        modifiedDate: Date;
    }

    export interface BillOfMaterialHeatTransfer {
        dataBaseContextUuid: string;
        businessId: number;
        language: string;
        productId: string;
        materialPositionId: string;
        meshId: number;
        frameNumber: number;
        pressure: number;
        light: number;
        squeegeeSpeed: number;
        squeegeePressure: number;
        squeegeAngle: string;
        floodBarPressure: number;
        fpmSpeed: number;
        outletHeat: number;
        middleHeat: number;
        inletHeat: number;
        commnets: string;
        registerStatusId: number;
        createdByUser: string;
        creationDate: Date;
        modifiedByUser: string;
        modifiedDate: Date;
    }

    export interface ProductOption {
        dataBaseContextUuid: string;
        businessId: number;
        language: string;
        productId: string;
        optionId: number;
        registerStatusId: number;
    }

    export interface TechnicalData {
        dataBaseContextUuid: string;
        businessId: number;
        language: string;
        productId: string;
        resourceModelId: number;
        altenalResourceModel: string;
        resourceId: number;
        speed: number;
        standarTime: number;
        stationNumber: number;
        picks: number;
        totalPicks: number;
        cameraPicks: number;
        machinePicks: number;
        defaultModel: string;
        stampCylinderId: number;
        repetitionNumber: number;
        perforationType: string;
        perforationDiameter: number;
        engravedType: string;
        sheetTypeId: number;
        paperWidth: number;
        paperRealease: number;
        quantitySheet: number;
        advance: number;
        squeegeeTravel: number;
        screenPeelOff: number;
        offCont: number;
        numberOfOutputs: number;
    }

    export interface TechnicalSheets {
        product: Product;
        sample: Sample;
        customerReference: CustomerReference;
        billOfMaterial: BillOfMaterial[];
        billOfMaterialFlexo: BillOfMaterialFlexo[];
        billOfMaterialHeatTransfer: BillOfMaterialHeatTransfer[];
        productOption: ProductOption[];
        technicalData: TechnicalData[];
        createdByUser: string;
        creationDate: string;
        modifiedByUser: string;
        modifiedDate: number;
    }
}