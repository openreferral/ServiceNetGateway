package org.benetech.servicenet.service;

import java.util.List;
import org.benetech.servicenet.domain.DataImportReport;
import org.benetech.servicenet.domain.Taxonomy;

public interface TaxonomyImportService {

    Taxonomy createOrUpdateTaxonomy(Taxonomy taxonomy, String externalDbId, String providerName, DataImportReport report);

    void importTaxonomies(List<Taxonomy> taxonomies);
}
