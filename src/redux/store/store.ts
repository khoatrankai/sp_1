import { configureStore } from "@reduxjs/toolkit";
import typeProductReducer from "@/redux/store/slices/productSlices/get_type.slice";
import unitProductSlice from "./slices/productSlices/get_unit.slice";
import vatSystemSlice from "./slices/systemSlices/get_vat.slice";
import infoProductSlice from "./slices/productSlices/get_products";
import aboutProductSlice from "./slices/productSlices/get_about.slice";
import customerInfoSlice from "./slices/customerSlices/get_all_customer.slice";
import customerAboutSlice from "./slices/customerSlices/about_customer.slice";
import provinceSystemSlice from "./slices/systemSlices/get_province.slice";
import typeOpportunitySlice from "./slices/opportunitySlices/get_type.slice";
import sourcesOpportunitySlice from "./slices/opportunitySlices/get_source.slice";
import userInfoSlice from "./slices/userSlices/get_users.slice";
import opportunitySlice from "./slices/opportunitySlices/get_opportunities.slice";
import projectsSlice from "./slices/projectSlices/get_all_project.slice";
import priceQuoteSlice from "./slices/priceQuoteSlices/get_price_quotes.slice";
import typeMethodSlice from "./slices/contractSlices/type_method.slice";
import typeContractSlice from "./slices/contractSlices/type_contract.slide";
import contractSlice from "./slices/contractSlices/contract.slide";
import paymentSlice from "./slices/contractSlices/payment.slide";
import activitySlice from "./slices/activitySlices/activity.slice";
import workSlice from "./slices/activitySlices/work.slide";
import typeActivitySlice from "./slices/activitySlices/type_activity.slice";
import typeWorkSlice from "./slices/activitySlices/type_work.slice";
import customerGroupSlice from "./slices/customerSlices/get_all_group.slice";
import statusActivitySlice from "./slices/activitySlices/status_activity.slice";
import statusWorkSlice from "./slices/activitySlices/status_work.slice";
import supplierSlice from "./slices/productSlices/get_supplier.slice";
import activityContainerSlice from "./slices/productSlices/get_activity_container.slice";
import profitSystemSlice from "./slices/systemSlices/get_profit.slice";
import brandProductSlice from "./slices/productSlices/get_brand.slice";
import originalProductSlice from "./slices/productSlices/get_original.slice";
import statusMenu from "./slices/menu.slice";
import imagePreview from "./slices/image-preview.slice";
import userProfileSlice from "./slices/userSlices/get_profile.slice";
import typeProjectSlice from "./slices/projectSlices/get_type.slice";
import classifyTypeSlice from "./slices/productSlices/get_classify.slice";
import typeActivityIDSlice from "./slices/activitySlices/type_id_activity.slice";
import typeFullProjectSlice from "./slices/projectSlices/get_full_type.slice";
import typeWorkIDSlice from "./slices/activitySlices/type_id_work.slice";
import categoryRoleSlice from "./slices/userSlices/get_category_role.slice";
import roleAccessSlice from "./slices/userSlices/get_role.slice";
import typePackageSlice from "./slices/priceQuoteSlices/get_type_package.slice";
import aboutProjectSlice from "./slices/projectSlices/get_about.slice";
import aboutContractSlice from "./slices/contractSlices/get_about.slice";
import customerFilterSlice from "./slices/customerSlices/get_filter_customer.slice";
import customerAccountSlice from "./slices/customerSlices/get_all_account.slice";
import userGroupSlice from "./slices/userSlices/get_all_group.slice";
import userFilterSlice from "./slices/userSlices/get_filter_user.slice";
import linkSystemSlice from "./slices/systemSlices/get_linksystem.slice";
import targetRevenueSlice from "./slices/systemSlices/get_target.slice";
import workFilterSlice from "./slices/activitySlices/work_filter.slide";
import paymentTotalSlice from "./slices/contractSlices/payment_total.slide";
import customerProfileSlice from "./slices/customerSlices/get_profile.slice";
import notifySlice from "./slices/userSlices/get_notify.slice";
import countNotifySlice from "./slices/userSlices/get_count_notify.slice";
import cartsSlice from "./slices/productSlices/get_order.slice";
import timekeepingSlice from "./slices/userSlices/get_timekeeping.slice";
import checkTimekeepingSlice from "./slices/userSlices/check_timekeeping.slice";
import dashboardAllOpportunitySlice from "./slices/opportunitySlices/get_dashboard_opportunity.slice";
import opportunityByPriceQuoteSlice from "./slices/opportunitySlices/get_opportunity_price_quote.slice";
import opportunityHaveContractSlice from "./slices/opportunitySlices/get_opportunity_contract.slice";

export const store = configureStore({
  reducer: {
    type_product: typeProductReducer,
    unit_product: unitProductSlice,
    brand_product: brandProductSlice,
    original_product: originalProductSlice,
    vat_system: vatSystemSlice,
    info_products: infoProductSlice,
    about_product: aboutProductSlice,
    infos_customer: customerInfoSlice,
    get_account_customers: customerAccountSlice,
    about_customer: customerAboutSlice,
    province_system: provinceSystemSlice,
    type_opportunity: typeOpportunitySlice,
    source_opportunity: sourcesOpportunitySlice,
    get_users: userInfoSlice,
    get_opportunities: opportunitySlice,
    get_projects: projectsSlice,
    get_project_about: aboutProjectSlice,
    type_projects: typeProjectSlice,
    type_full_projects: typeFullProjectSlice,
    get_price_quotes: priceQuoteSlice,
    get_type_method: typeMethodSlice,
    get_type_contract: typeContractSlice,
    get_contracts: contractSlice,
    get_contract_about: aboutContractSlice,
    get_payments: paymentSlice,
    get_payment_total: paymentTotalSlice,
    get_activities: activitySlice,
    get_works: workSlice,
    get_works_filter: workFilterSlice,
    get_type_activities: typeActivitySlice,
    get_type_id_activities: typeActivityIDSlice,
    get_type_id_works: typeWorkIDSlice,
    get_type_work: typeWorkSlice,
    get_group_customer: customerGroupSlice,
    get_group_user: userGroupSlice,
    get_filter_customer: customerFilterSlice,
    get_filter_user: userFilterSlice,
    get_status_activity: statusActivitySlice,
    get_status_work: statusWorkSlice,
    get_supplier: supplierSlice,
    get_activity_container: activityContainerSlice,
    get_profits: profitSystemSlice,
    get_link_system: linkSystemSlice,
    get_target_revenue: targetRevenueSlice,
    status_tab_menu: statusMenu,
    image_preview: imagePreview,
    get_profile: userProfileSlice,
    get_profile_customer: customerProfileSlice,
    get_category_roles: categoryRoleSlice,
    get_access_roles: roleAccessSlice,
    type_package: typePackageSlice,
    get_classify_type: classifyTypeSlice,
    get_notify: notifySlice,
    get_count_notify: countNotifySlice,
    get_carts: cartsSlice,
    get_timekeepings: timekeepingSlice,
    get_opportunities_dashboard: dashboardAllOpportunitySlice,
    get_opportunities_by_price_quote: opportunityByPriceQuoteSlice,
    get_opportunities_have_contract: opportunityHaveContractSlice,
    check_timekeepings: checkTimekeepingSlice,
  },
});

// Tạo các type cho RootState và AppDispatch để sử dụng TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
