"use client";

/**
 * Template Method Pattern (FE):
 * urutan render fixed, detail di-override oleh halaman/komponen turunan.
 */
export default abstract class OfferTemplate {
  protected constructor(_sidebar?: any) {}

  // Template Method
  public renderPage(): any {
    return (
      <div className="p-10 w-full">
        {this.renderHeader()}
        {this.renderMainCard()}
      </div>
    );
  }

  protected abstract renderHeader(): any;

  protected abstract renderMainCard(): any;
}


